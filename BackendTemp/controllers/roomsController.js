const { Op } = require('sequelize');
const Room = require('../models/roomModel');
const Booking = require('../models/bookingModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Retrieves all room records with support for filtering, sorting, and pagination
exports.getAllRooms = catchAsync(async (req, res, next) => {
  const {
    roomType,
    minPrice,
    maxPrice,
    capacity,
    available,
    sort,
    page,
    limit,
  } = req.query;

  const whereClause = {};

  if (roomType) {
    whereClause.roomType = roomType;
  }

  if (available !== undefined && available !== null && available !== '') {
    whereClause.available = available === 'true' || available === true;
  }

  if (capacity && !isNaN(capacity)) {
    whereClause.capacity = { [Op.gte]: Number(capacity) };
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice && !isNaN(minPrice)) {
      whereClause.price[Op.gte] = Number(minPrice);
    }
    if (maxPrice && !isNaN(maxPrice)) {
      whereClause.price[Op.lte] = Number(maxPrice);
    }
  }

  let order = [['id', 'DESC']];
  if (sort) {
    const sortFields = sort.split(',').map((field) => {
      const direction = field.startsWith('-') ? 'DESC' : 'ASC';
      const cleanField = field.replace(/^-/, '');
      return [cleanField, direction];
    });
    order = sortFields;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows: rooms } = await Room.findAndCountAll({
    where: whereClause,
    order,
    limit: limitNum,
    offset,
  });

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    totalCount: count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
    data: {
      rooms,
    },
  });
});

// Retrieves details of a specific room along with its active and upcoming bookings
exports.getRoomById = catchAsync(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id, {
    include: [
      {
        model: Booking,
        attributes: ['id', 'checkInDate', 'checkOutDate', 'status'],
        where: {
          status: { [Op.notIn]: ['cancelled'] },
          checkOutDate: { [Op.gte]: new Date() },
        },
        required: false,
      },
    ],
  });

  if (!room) {
    return next(new AppError('No room found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      room,
    },
  });
});

// Creates a new room entry ensuring room number uniqueness
exports.createRoom = catchAsync(async (req, res, next) => {
  const {
    roomNumber,
    roomType,
    price,
    capacity,
    description,
    amenities,
    available,
  } = req.body;

  if (!roomNumber || !roomType || !price) {
    return next(
      new AppError('Please provide room number, room type, and price.', 400),
    );
  }

  const existingRoom = await Room.findOne({ where: { roomNumber } });
  if (existingRoom) {
    return next(new AppError(`Room number ${roomNumber} already exists.`, 400));
  }

  const newRoom = await Room.create({
    roomNumber,
    roomType,
    price,
    capacity: capacity || 2,
    description: description || '',
    amenities: Array.isArray(amenities) ? amenities : [],
    available: available !== undefined ? available : true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      room: newRoom,
    },
  });
});

// Updates attributes of an existing room record
exports.updateRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID.', 404));
  }

  if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
    const existing = await Room.findOne({
      where: { roomNumber: req.body.roomNumber },
    });
    if (existing) {
      return next(
        new AppError(
          `Room number ${req.body.roomNumber} is already in use.`,
          400,
        ),
      );
    }
  }

  await room.update(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      room,
    },
  });
});

// Toggles the availability status of a room between available and out of service
exports.toggleRoomAvailability = catchAsync(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID.', 404));
  }

  const updatedRoom = await room.update({ available: !room.available });

  res.status(200).json({
    status: 'success',
    message: `Room status changed to ${updatedRoom.available ? 'available' : 'out of service'}.`,
    data: {
      room: updatedRoom,
    },
  });
});

// Deletes a room record after verifying there are no active or future reservations
exports.deleteRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID.', 404));
  }

  const activeBookings = await Booking.findOne({
    where: {
      roomId: room.id,
      status: { [Op.notIn]: ['cancelled'] },
      checkOutDate: { [Op.gte]: new Date() },
    },
  });

  if (activeBookings) {
    return next(
      new AppError(
        'Cannot delete room with active or upcoming reservations. Cancel bookings first.',
        400,
      ),
    );
  }

  await room.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
