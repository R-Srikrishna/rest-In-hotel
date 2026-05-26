const BookingModel = require('../models/bookingModel');
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

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { checkInDate, checkOutDate, roomId, guestId, totalPrice, status } = req.body;

  if (!checkInDate || !checkOutDate || !roomId || !guestId || !totalPrice) {
    return next(new AppError('Please provide all required booking details', 400));
  }

  const newBooking = await BookingModel.create({
    checkInDate,
    checkOutDate,
    roomId,
    guestId,
    totalPrice,
    status
  });

  res.status(201).json({
    status: 'success',
    booking: newBooking
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { checkInDate, checkOutDate, roomId, guestId, totalPrice, status } = req.body;

  const booking = await BookingModel.findByPk(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  await booking.update({
    checkInDate,
    checkOutDate,
    roomId,
    guestId,
    totalPrice,
    status
  });

  res.status(200).json({
    status: 'success',
    booking
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const booking = await BookingModel.findByPk(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  await booking.destroy();

  res.status(200).json({
    status: 'success',
    message: 'Booking deleted successfully'
  });
});

exports.getBookingById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const booking = await BookingModel.findByPk(id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(200).json({
    status: 'success',
    booking
  });
});

exports.getBookingsByGuestId = catchAsync(async (req, res) => {
  const { guestId } = req.params;
  const bookings = await BookingModel.findAll({ where: { guestId } });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

exports.getBookingsByRoomId = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const bookings = await BookingModel.findAll({ where: { roomId } });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

exports.getBookingsByStatus = catchAsync(async (req, res) => {
  const { status } = req.params;
  const bookings = await BookingModel.findAll({ where: { status } });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

exports.getBookingsByDateRange = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(new AppError('Please provide startDate and endDate query parameters', 400));
  }

  const bookings = await BookingModel.findAll({
    where: {
      checkInDate: {
        [Op.gte]: startDate
      },
      checkOutDate: {
        [Op.lte]: endDate
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

exports.getBookingsByPriceRange = catchAsync(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  const where = {};
  if (minPrice) where.totalPrice = { ...(where.totalPrice || {}), [Op.gte]: Number(minPrice) };
  if (maxPrice) where.totalPrice = { ...(where.totalPrice || {}), [Op.lte]: Number(maxPrice) };

  const bookings = await BookingModel.findAll({ where });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

exports.getBookingsByStatusAndDateRange = catchAsync(async (req, res) => {
  const { status, startDate, endDate } = req.query;
  const where = {};

  if (status) where.status = status;
  if (startDate) where.checkInDate = { [Op.gte]: startDate };
  if (endDate) where.checkOutDate = { [Op.lte]: endDate };

  const bookings = await BookingModel.findAll({ where });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

exports.getBookingsByGuestIdAndStatus = catchAsync(async (req, res) => {
  const { guestId, status } = req.query;

  const where = {};
  if (guestId) where.guestId = guestId;
  if (status) where.status = status;

  const bookings = await BookingModel.findAll({ where });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    bookings
  });
});

