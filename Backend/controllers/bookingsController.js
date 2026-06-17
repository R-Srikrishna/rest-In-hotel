const BookingModel = require('../models/bookingModel');
const Room = require('../models/roomModel');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getBookings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query, { where: {} })
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await BookingModel.findAll(features.options);

  // Optionally include room details for each booking
  const bookingsWithRoomDetails = await Promise.all(
    bookings.map(async (booking) => {
      const room = await Room.findByPk(booking.roomId);
      return {
        ...booking.toJSON(),
        roomDetails: room
          ? {
              roomNumber: room.roomNumber,
              roomType: room.roomType,
            }
          : null,
      };
    }),
  );

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings: bookingsWithRoomDetails,
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const {
    checkInDate,
    checkOutDate,
    roomId,
    guestId,
    totalPrice,
    nightlyRate,
    selectedFeatures,
    status,
  } = req.body;

  // Validate required fields
  if (!checkInDate || !checkOutDate || !roomId || !guestId) {
    return next(
      new AppError('Please provide all required booking details', 400),
    );
  }

  // Verify room exists
  const room = await Room.findByPk(roomId);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Check for date conflicts with existing bookings
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn >= checkOut) {
    return next(
      new AppError('Check-out date must be after check-in date', 400),
    );
  }

  const conflictingBooking = await BookingModel.findOne({
    where: {
      roomId: roomId,
      [Op.or]: [
        {
          checkInDate: {
            [Op.lt]: checkOut,
          },
          checkOutDate: {
            [Op.gt]: checkIn,
          },
        },
      ],
      status: {
        [Op.in]: ['booked', 'checked-in'],
      },
    },
  });

  if (conflictingBooking) {
    return next(
      new AppError('Room is not available for the selected dates', 409),
    );
  }

  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const finalNightlyRate = nightlyRate !== undefined ? nightlyRate : room.price;
  const finalTotalPrice =
    totalPrice !== undefined ? totalPrice : finalNightlyRate * nights;

  // Create booking in database
  const newBooking = await BookingModel.create({
    checkInDate,
    checkOutDate,
    roomId,
    guestId,
    nightlyRate: finalNightlyRate,
    totalPrice: finalTotalPrice,
    selectedFeatures: selectedFeatures || {
      tv: room.tv,
      fridge: room.fridge,
      washingMachine: room.washingMachine,
      heater: room.heater,
      bathtub: room.bathtub,
      internetAccess: room.internetAccess,
      coffeeTea: room.coffeeTea,
      privatePool: room.privatePool,
      airConditioning: room.airConditioning,
      fan: room.fan,
      bed: room.bed,
    },
    status: status || 'booked',
  });

  // Update room availability to false when booking is created
  if (newBooking.status === 'booked' || newBooking.status === 'checked-in') {
    await room.update({
      available: false,
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Booking created successfully and stored in database',
    booking: newBooking,
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { checkInDate, checkOutDate, roomId, guestId, totalPrice, status } =
    req.body;

  // Find booking
  const booking = await BookingModel.findByPk(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // If roomId is being changed, verify new room exists
  if (roomId && roomId !== booking.roomId) {
    const newRoom = await Room.findByPk(roomId);
    if (!newRoom) {
      return next(new AppError('New room not found', 404));
    }
  }

  // Get current room
  const currentRoom = await Room.findByPk(booking.roomId);

  // Update booking
  await booking.update({
    checkInDate: checkInDate || booking.checkInDate,
    checkOutDate: checkOutDate || booking.checkOutDate,
    roomId: roomId || booking.roomId,
    guestId: guestId || booking.guestId,
    totalPrice: totalPrice || booking.totalPrice,
    status: status || booking.status,
  });

  // Handle room availability based on booking status
  if (status) {
    if (status === 'cancelled') {
      // When booking is cancelled, make room available again
      if (currentRoom) {
        await currentRoom.update({ available: true });
      }
    } else if (status === 'checked-out') {
      // When guest checks out, make room available again
      if (currentRoom) {
        await currentRoom.update({ available: true });
      }
    } else if (status === 'booked' || status === 'checked-in') {
      // When booking is confirmed or guest checks in, mark room unavailable
      if (currentRoom) {
        await currentRoom.update({ available: false });
      }
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'Booking updated successfully',
    booking,
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find booking
  const booking = await BookingModel.findByPk(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Get the room associated with this booking
  const room = await Room.findByPk(booking.roomId);

  // Delete booking
  await booking.destroy();

  // Make room available again when booking is deleted
  if (
    room &&
    (booking.status === 'booked' || booking.status === 'checked-in')
  ) {
    await room.update({
      available: true,
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Booking deleted successfully and room availability updated',
  });
});

exports.getBookingById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const booking = await BookingModel.findByPk(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Get room details for this booking
  const room = await Room.findByPk(booking.roomId);

  res.status(200).json({
    status: 'success',
    booking: {
      ...booking.toJSON(),
      roomDetails: room
        ? {
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            nightlyRate: room.price,
            amenities: {
              tv: room.tv,
              fridge: room.fridge,
              washingMachine: room.washingMachine,
              heater: room.heater,
              bathtub: room.bathtub,
              internetAccess: room.internetAccess,
              coffeeTea: room.coffeeTea,
              privatePool: room.privatePool,
              airConditioning: room.airConditioning,
              fan: room.fan,
              bed: room.bed,
            },
          }
        : null,
    },
  });
});

exports.getBookingsByGuestId = catchAsync(async (req, res) => {
  const { guestId } = req.params;
  const bookings = await BookingModel.findAll({ where: { guestId } });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings,
  });
});

exports.getBookingsByRoomId = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const bookings = await BookingModel.findAll({ where: { roomId } });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings,
  });
});

exports.getBookingsByStatus = catchAsync(async (req, res) => {
  const { status } = req.params;
  const bookings = await BookingModel.findAll({ where: { status } });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings,
  });
});

exports.getBookingsByDateRange = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new AppError(
        'Please provide startDate and endDate query parameters',
        400,
      ),
    );
  }

  const bookings = await BookingModel.findAll({
    where: {
      checkInDate: {
        [Op.gte]: startDate,
      },
      checkOutDate: {
        [Op.lte]: endDate,
      },
    },
  });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings,
  });
});

exports.getBookingsByPriceRange = catchAsync(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  const where = {};
  if (minPrice)
    where.totalPrice = {
      ...(where.totalPrice || {}),
      [Op.gte]: Number(minPrice),
    };
  if (maxPrice)
    where.totalPrice = {
      ...(where.totalPrice || {}),
      [Op.lte]: Number(maxPrice),
    };

  const bookings = await BookingModel.findAll({ where });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings,
  });
});
