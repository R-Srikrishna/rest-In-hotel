const Room = require('../models/roomModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// =============================================================================
// 🟢 CLIENT (GUEST) & PUBLIC ACTIONS
// =============================================================================

// 1. Get ONLY available rooms (for guest booking catalog)
exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  const rooms = await Room.findAll({
    where: { isAvailable: true },
  });

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    data: {
      rooms,
    },
  });
});

// 2. Get single room details by ID
exports.getRoomById = catchAsync(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      room,
    },
  });
});

// =============================================================================
// 🔴 ADMIN & SUPER-ADMIN ROOM MANAGEMENT
// =============================================================================

// 3. Admin: Get ALL rooms (including unavailable/maintenance rooms)
exports.getRooms = catchAsync(async (req, res, next) => {
  const rooms = await Room.findAll();

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    data: {
      rooms,
    },
  });
});

// 4. Admin: Create a new room
exports.createRoom = catchAsync(async (req, res, next) => {
  const {
    roomNumber,
    type,
    price,
    capacity,
    description,
    amenities,
    isAvailable,
  } = req.body;

  if (!roomNumber || !type || !price) {
    return next(
      new AppError('Please provide room number, type, and price.', 400),
    );
  }

  // Check for existing room number
  const existingRoom = await Room.findOne({ where: { roomNumber } });
  if (existingRoom) {
    return next(new AppError('A room with this number already exists.', 400));
  }

  const newRoom = await Room.create({
    roomNumber,
    type,
    price,
    capacity,
    description,
    amenities,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      room: newRoom,
    },
  });
});

// 5. Admin: Update room details (price, availability, type, etc.)
exports.updateRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  // Prevent duplicate room numbers when updating
  if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
    const existingRoom = await Room.findOne({
      where: { roomNumber: req.body.roomNumber },
    });
    if (existingRoom) {
      return next(new AppError('A room with this number already exists.', 400));
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

// 6. Admin: Delete room
exports.deleteRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByPk(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  await room.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
