const { Op } = require('sequelize');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const Guest = require('../models/guestModel');
const { sequelize } = require('../models/bookingModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Checks if a room has overlapping active bookings for a given date range
const isRoomBooked = async (
  roomId,
  checkInDate,
  checkOutDate,
  excludeBookingId = null,
  transaction = null,
) => {
  const whereClause = {
    roomId,
    status: { [Op.notIn]: ['cancelled'] },
    checkInDate: { [Op.lt]: checkOutDate },
    checkOutDate: { [Op.gt]: checkInDate },
  };

  if (excludeBookingId) {
    whereClause.id = { [Op.ne]: excludeBookingId };
  }

  const existingBooking = await Booking.findOne({
    where: whereClause,
    transaction,
  });

  return !!existingBooking;
};

// Calculates the total number of nights between check-in and check-out dates
const calculateNights = (checkInStr, checkOutStr) => {
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return 0;
  }

  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

// Retrieves all available rooms for a given date range that are not already booked
exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  const { checkInDate, checkOutDate } = req.query;

  if (!checkInDate || !checkOutDate) {
    return next(
      new AppError('Please select both check-in and check-out dates.', 400),
    );
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    return next(
      new AppError('Check-out date must be after check-in date.', 400),
    );
  }

  const bookedRooms = await Booking.findAll({
    attributes: ['roomId'],
    where: {
      status: { [Op.notIn]: ['cancelled'] },
      checkInDate: { [Op.lt]: checkOutDate },
      checkOutDate: { [Op.gt]: checkInDate },
    },
  });

  const bookedRoomIds = bookedRooms.map((b) => b.roomId);

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

// Handles creation of a new room booking by a authenticated guest inside a transaction
exports.createBooking = catchAsync(async (req, res, next) => {
  const { roomId, checkInDate, checkOutDate, selectedFeatures } = req.body;
  const guestId = req.user.id;

  if (!roomId || !checkInDate || !checkOutDate) {
    return next(
      new AppError(
        'Please provide room ID, check-in, and check-out dates.',
        400,
      ),
    );
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    return next(
      new AppError(
        'Check-out date must be at least 1 day after check-in date.',
        400,
      ),
    );
  }

  const result = await sequelize.transaction(async (t) => {
    const room = await Room.findByPk(roomId, { transaction: t });
    if (!room) {
      throw new AppError('No room found with that ID.', 404);
    }

    if (!room.available) {
      throw new AppError('This room is currently out of service.', 400);
    }

    const booked = await isRoomBooked(
      roomId,
      checkInDate,
      checkOutDate,
      null,
      t,
    );
    if (booked) {
      throw new AppError(
        'This room is already reserved for the selected dates.',
        400,
      );
    }

    const nightlyRate = Number(room.price);
    const totalPrice = nights * nightlyRate;

    const newBooking = await Booking.create(
      {
        guestId,
        guestName: req.user.name || req.body.guestName,
        roomId,
        checkInDate,
        checkOutDate,
        nightlyRate,
        totalPrice,
        selectedFeatures: selectedFeatures || null,
        status: 'booked',
      },
      { transaction: t },
    );

    return newBooking;
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking: result,
    },
  });
});

// Retrieves all booking records belonging to the logged-in guest
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

// Retrieves a specific booking by ID belonging to the logged-in guest
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
      new AppError('No booking found with that ID under your account.', 404),
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Fetches all booking records with guest and room details for admin management
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

// Fetches a single booking record by ID with associated guest and room details
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
    return next(new AppError('No booking found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Allows admins to create a booking on behalf of a guest inside a transaction
exports.createAdminBooking = catchAsync(async (req, res, next) => {
  const {
    guestId,
    roomId,
    checkInDate,
    checkOutDate,
    status,
    selectedFeatures,
  } = req.body;

  if (!guestId || !roomId || !checkInDate || !checkOutDate) {
    return next(
      new AppError(
        'Please provide guestId, roomId, and valid date range.',
        400,
      ),
    );
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    return next(
      new AppError('Check-out date must be after check-in date.', 400),
    );
  }

  const result = await sequelize.transaction(async (t) => {
    const guest = await Guest.findByPk(guestId, { transaction: t });
    if (!guest) {
      throw new AppError('No guest found with that ID.', 404);
    }

    const room = await Room.findByPk(roomId, { transaction: t });
    if (!room) {
      throw new AppError('No room found with that ID.', 404);
    }

    const booked = await isRoomBooked(
      roomId,
      checkInDate,
      checkOutDate,
      null,
      t,
    );
    if (booked) {
      throw new AppError(
        'This room is already reserved for the selected dates.',
        400,
      );
    }

    const nightlyRate = req.body.nightlyRate || Number(room.price);
    const totalPrice = req.body.totalPrice || nights * nightlyRate;

    const newBooking = await Booking.create(
      {
        guestId,
        roomId,
        checkInDate,
        checkOutDate,
        nightlyRate,
        totalPrice,
        selectedFeatures: selectedFeatures || null,
        status: status || 'booked',
      },
      { transaction: t },
    );

    return newBooking;
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking: result,
    },
  });
});

// Updates details of an existing booking while ensuring schedule availability
exports.updateBooking = catchAsync(async (req, res, next) => {
  const result = await sequelize.transaction(async (t) => {
    const booking = await Booking.findByPk(req.params.id, { transaction: t });

    if (!booking) {
      throw new AppError('No booking found with that ID.', 404);
    }

    const roomId = req.body.roomId || booking.roomId;
    const checkInDate = req.body.checkInDate || booking.checkInDate;
    const checkOutDate = req.body.checkOutDate || booking.checkOutDate;

    if (req.body.checkInDate || req.body.checkOutDate) {
      const nights = calculateNights(checkInDate, checkOutDate);
      if (nights <= 0) {
        throw new AppError('Check-out date must be after check-in date.', 400);
      }
    }

    if (req.body.roomId || req.body.checkInDate || req.body.checkOutDate) {
      const booked = await isRoomBooked(
        roomId,
        checkInDate,
        checkOutDate,
        booking.id,
        t,
      );
      if (booked) {
        throw new AppError(
          'This room is already reserved for these dates.',
          400,
        );
      }
    }

    await booking.update(req.body, { transaction: t });
    return booking;
  });

  res.status(200).json({
    status: 'success',
    data: {
      booking: result,
    },
  });
});

// Deletes a booking record by ID
exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID.', 404));
  }

  await booking.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
