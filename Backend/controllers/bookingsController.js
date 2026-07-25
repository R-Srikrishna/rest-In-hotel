const { Op } = require('sequelize');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Guest = require('../models/guestModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// =============================================================================
// 🛠️ HELPER FUNCTIONS
// =============================================================================

/**
 * Checks if a room has overlapping active bookings for a given date range.
 * Overlap formula: (existingCheckIn < newCheckOut) AND (existingCheckOut > newCheckIn)
 */
const isRoomBooked = async (
  roomId,
  checkInDate,
  checkOutDate,
  excludeBookingId = null,
) => {
  const whereClause = {
    roomId,
    status: { [Op.notIn]: ['cancelled'] }, // Ignore cancelled bookings
    checkInDate: { [Op.lt]: checkOutDate },
    checkOutDate: { [Op.gt]: checkInDate },
  };

  if (excludeBookingId) {
    whereClause.id = { [Op.ne]: excludeBookingId };
  }

  const existingBooking = await Booking.findOne({ where: whereClause });
  return !!existingBooking;
};

// =============================================================================
// 🟢 CLIENT (GUEST) SIDE ACTIONS
// =============================================================================

// 1. Client views all available rooms for selected dates
exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  const { checkInDate, checkOutDate } = req.query;

  if (!checkInDate || !checkOutDate) {
    return next(
      new AppError('Please select both check-in and check-out dates.', 400),
    );
  }

  // Find all rooms booked within the selected date range
  const bookedRooms = await Booking.findAll({
    attributes: ['roomId'],
    where: {
      status: { [Op.notIn]: ['cancelled'] },
      checkInDate: { [Op.lt]: checkOutDate },
      checkOutDate: { [Op.gt]: checkInDate },
    },
  });

  const bookedRoomIds = bookedRooms.map((b) => b.roomId);

  // Fetch active rooms that are NOT in the booked room IDs list
  const availableRooms = await Room.findAll({
    where: {
      available: true,
      id: { [Op.notIn]: bookedRoomIds.length > 0 ? bookedRoomIds : [0] },
    },
  });

  res.status(200).json({
    status: 'success',
    results: availableRooms.length,
    data: {
      rooms: availableRooms,
    },
  });
});

// 2. Client creates a booking for an available room
exports.createBooking = catchAsync(async (req, res, next) => {
  const { roomId, checkInDate, checkOutDate, totalPrice, selectedFeatures } =
    req.body;
  const guestId = req.user.id; // Tied directly to logged-in guest context

  if (!roomId || !checkInDate || !checkOutDate || !totalPrice) {
    return next(
      new AppError('Please provide room, dates, and total price.', 400),
    );
  }

  // Check if room exists
  const room = await Room.findByPk(roomId);
  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  // Check if room is active/available
  if (room.available === false) {
    return next(new AppError('This room is currently out of service', 400));
  }

  // Check date collision/overlap
  const booked = await isRoomBooked(roomId, checkInDate, checkOutDate);
  if (booked) {
    return next(
      new AppError(
        'This room is already reserved for the selected dates.',
        400,
      ),
    );
  }

  // 💡 Resolve nightlyRate directly from req.body OR from room.price
  const nightlyRate = req.body.nightlyRate || room.price;

  if (!nightlyRate) {
    return next(
      new AppError('Nightly rate could not be determined for this room.', 400),
    );
  }

  // Create booking
  const newBooking = await Booking.create({
    guestId,
    guestName: req.body.guestName,
    roomId,
    checkInDate,
    checkOutDate,
    nightlyRate, // 👈 Added required field
    totalPrice,
    selectedFeatures: selectedFeatures || null,
    status: 'booked', // 👈 Updated to match Model ENUM ('booked')
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking: newBooking,
    },
  });
});

// 3. Client views all their own bookings history
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: { guestId: req.user.id },
    include: [
      {
        model: Room,
        attributes: ['id', 'roomNumber', 'roomType', 'price'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

// 4. Client views a single booking detail
exports.getMyBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    where: { id: req.params.id, guestId: req.user.id },
    include: [
      {
        model: Room,
        attributes: ['id', 'roomNumber', 'roomType', 'price'],
      },
    ],
  });

  if (!booking) {
    return next(
      new AppError('No booking found with that ID under your account', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// =============================================================================
// 🔴 ADMIN SIDE ACTIONS (BOOKINGS DASHBOARD)
// =============================================================================

// 1. Admin Dashboard: Get total/all bookings in the system
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.findAll({
    include: [
      {
        model: Guest,
        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
      },
      {
        model: Room,
        attributes: ['id', 'roomNumber', 'roomType', 'price'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

// 2. Admin Dashboard: Get single booking details
exports.getBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.id, {
    include: [
      {
        model: Guest,
        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
      },
      {
        model: Room,
        attributes: ['id', 'roomNumber', 'roomType', 'price'],
      },
    ],
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// 3. Admin Dashboard: Add booking manually for any guest
exports.createAdminBooking = catchAsync(async (req, res, next) => {
  const {
    guestId,
    roomId,
    checkInDate,
    checkOutDate,
    totalPrice,
    status,
    selectedFeatures,
  } = req.body;

  if (!guestId || !roomId || !checkInDate || !checkOutDate || !totalPrice) {
    return next(
      new AppError(
        'Please provide guestId, roomId, dates, and total price.',
        400,
      ),
    );
  }

  // Ensure guest exists
  const guest = await Guest.findByPk(guestId);
  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  // Ensure room exists
  const room = await Room.findByPk(roomId);
  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  // Check date collision/overlap
  const booked = await isRoomBooked(roomId, checkInDate, checkOutDate);
  if (booked) {
    return next(
      new AppError(
        'This room is already reserved for the selected dates.',
        400,
      ),
    );
  }

  // 💡 Resolve nightlyRate directly from req.body OR from room.price
  const nightlyRate = req.body.nightlyRate || room.price;

  if (!nightlyRate) {
    return next(
      new AppError('Nightly rate could not be determined for this room.', 400),
    );
  }

  // Create booking
  const newBooking = await Booking.create({
    guestId,
    roomId,
    checkInDate,
    checkOutDate,
    nightlyRate, // 👈 Added required field
    totalPrice,
    selectedFeatures: selectedFeatures || null,
    status: status || 'booked', // 👈 Updated to match Model ENUM
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking: newBooking,
    },
  });
});

// 4. Admin Dashboard: Update booking (status, dates, room assignment)
exports.updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  const roomId = req.body.roomId || booking.roomId;
  const checkInDate = req.body.checkInDate || booking.checkInDate;
  const checkOutDate = req.body.checkOutDate || booking.checkOutDate;

  // Re-verify room availability if dates or rooms are updated
  if (req.body.roomId || req.body.checkInDate || req.body.checkOutDate) {
    const booked = await isRoomBooked(
      roomId,
      checkInDate,
      checkOutDate,
      booking.id,
    );
    if (booked) {
      return next(
        new AppError('This room is already reserved for these dates.', 400),
      );
    }
  }

  await booking.update(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// 5. Admin Dashboard: Delete booking from system
exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  await booking.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
