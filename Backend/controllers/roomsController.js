const Room = require('../models/roomModel');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const parseBoolean = value => value === true || value === 'true' || value === 1 || value === '1';

exports.getRooms = catchAsync(async (req, res) => {
  const features = new APIFeatures(req.query, { where: {} })
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const rooms = await Room.findAll(features.options);

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms
  });
});

exports.getRoomById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const room = await Room.findByPk(id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  res.status(200).json({
    status: 'success',
    room
  });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  const {
    roomNumber,
    roomType,
    price,
    available = true,
    tv = false,
    fridge = false,
    washingMachine = false,
    heater = false,
    bathtub = false,
    internetAccess = false,
    coffeeTea = false,
    privatePool = false
  } = req.body;

  if (!roomNumber || !roomType || price === undefined) {
    return next(new AppError('Please provide roomNumber, roomType, and price', 400));
  }

  const room = await Room.create({
    roomNumber,
    roomType,
    price,
    available: parseBoolean(available),
    tv: parseBoolean(tv),
    fridge: parseBoolean(fridge),
    washingMachine: parseBoolean(washingMachine),
    heater: parseBoolean(heater),
    bathtub: parseBoolean(bathtub),
    internetAccess: parseBoolean(internetAccess),
    coffeeTea: parseBoolean(coffeeTea),
    privatePool: parseBoolean(privatePool)
  });

  res.status(201).json({
    status: 'success',
    room
  });
});

exports.updateRoom = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    roomNumber,
    roomType,
    price,
    available,
    tv,
    fridge,
    washingMachine,
    heater,
    bathtub,
    internetAccess,
    coffeeTea,
    privatePool
  } = req.body;

  const room = await Room.findByPk(id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  await room.update({
    roomNumber,
    roomType,
    price,
    available: available !== undefined ? parseBoolean(available) : room.available,
    tv: tv !== undefined ? parseBoolean(tv) : room.tv,
    fridge: fridge !== undefined ? parseBoolean(fridge) : room.fridge,
    washingMachine: washingMachine !== undefined ? parseBoolean(washingMachine) : room.washingMachine,
    heater: heater !== undefined ? parseBoolean(heater) : room.heater,
    bathtub: bathtub !== undefined ? parseBoolean(bathtub) : room.bathtub,
    internetAccess: internetAccess !== undefined ? parseBoolean(internetAccess) : room.internetAccess,
    coffeeTea: coffeeTea !== undefined ? parseBoolean(coffeeTea) : room.coffeeTea,
    privatePool: privatePool !== undefined ? parseBoolean(privatePool) : room.privatePool
  });

  res.status(200).json({
    status: 'success',
    room
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const room = await Room.findByPk(id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  await room.destroy();

  res.status(200).json({
    status: 'success',
    message: 'Room deleted successfully'
  });
});

exports.getRoomsByType = catchAsync(async (req, res) => {
  const { roomType } = req.query;

  const rooms = await Room.findAll({
    where: {
      roomType: {
        [Op.like]: `%${roomType}%`
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms
  });
});

exports.getRoomsByPriceRange = catchAsync(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  const where = {};
  if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
  if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };

  const rooms = await Room.findAll({ where });

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms
  });
});

exports.getRoomsByTypeAndPriceRange = catchAsync(async (req, res) => {
  const { roomType, minPrice, maxPrice } = req.query;

  const where = {
    roomType: {
      [Op.like]: `%${roomType}%`
    }
  };

  if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
  if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };

  const rooms = await Room.findAll({ where });

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms
  });
});

exports.getRoomsByAvailability = catchAsync(async (req, res) => {
  const { available } = req.query;

  const rooms = await Room.findAll({
    where: {
      available: available === 'true' || available === true
    }
  });

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms
  });
});

exports.getRoomsByTypeAndAvailability = catchAsync(async (req, res) => {
  const { roomType, available } = req.query;

  const rooms = await Room.findAll({
    where: {
      roomType: {
        [Op.like]: `%${roomType}%`
      },
      available: available === 'true' || available === true
    }
  });

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms
  });
});