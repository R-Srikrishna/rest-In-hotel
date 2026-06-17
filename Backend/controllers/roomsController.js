const Room = require('../models/roomModel');
const Booking = require('../models/bookingModel');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const parseBoolean = (value) =>
  value === true ||
  value === 'true' ||
  value === 1 ||
  value === '1' ||
  value === 0 ||
  value === '0';

exports.getRooms = catchAsync(async (req, res) => {
  const rooms = await Room.findAll();

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms,
  });
});

// Inside backend controllers/roomsController.js
exports.getRoomById = catchAsync(async (req, res, next) => {
  console.log('Params:', req.params);

  const roomId = parseInt(req.params.id, 10);
  console.log('Parsed ID:', roomId);

  const room = await Room.findByPk(roomId);

  console.log('Room Found:', room);

  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  res.status(200).json({
    status: 'success',
    room,
  });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  console.log('Create Room Request Body:', req.body);
  const {
    roomNumber,
    roomType,
    price,
    status,
    available = true,
    tv = false,
    fridge = false,
    washingMachine = false,
    heater = false,
    bathtub = false,
    internetAccess = false,
    coffeeTea = false,
    privatePool = false,
    airConditioning = false,
    fan = false,
    sofa = false,
    chairs = false,
    bed = true,
  } = req.body;

  // 1. Keep validation here so your API sends clean errors instead of database crashes
  if (!roomNumber || !roomType || price === undefined) {
    return next(
      new AppError('Please provide roomNumber, roomType, and price', 400),
    );
  }

  // 2. Map the frontend 'status' text into a clean boolean for your database 'available' field
  let targetAvailability = available;
  if (status !== undefined) {
    targetAvailability = status === 'Available';
  }

  // 3. Create the entry matching your Sequelize model schema exactly
  const room = await Room.create({
    roomNumber,
    roomType,
    price,
    available: parseBoolean(targetAvailability),
    tv: parseBoolean(tv),
    fridge: parseBoolean(fridge),
    washingMachine: parseBoolean(washingMachine),
    heater: parseBoolean(heater),
    bathtub: parseBoolean(bathtub),
    internetAccess: parseBoolean(internetAccess),
    coffeeTea: parseBoolean(coffeeTea),
    privatePool: parseBoolean(privatePool),
    airConditioning: parseBoolean(airConditioning),
    fan: parseBoolean(fan),
    sofa: parseBoolean(sofa),
    chairs: parseBoolean(chairs),
    bed: parseBoolean(bed),
  });

  res.status(201).json({
    status: 'success',
    room,
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
    privatePool,
    airConditioning,
    fan,
    sofa,
    chairs,
    bed,
  } = req.body;

  const room = await Room.findByPk(id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  const updates = {};
  if (roomNumber !== undefined) updates.roomNumber = roomNumber;
  if (roomType !== undefined) updates.roomType = roomType;
  if (price !== undefined) updates.price = price;
  if (available !== undefined) updates.available = parseBoolean(available);
  if (tv !== undefined) updates.tv = parseBoolean(tv);
  if (fridge !== undefined) updates.fridge = parseBoolean(fridge);
  if (washingMachine !== undefined)
    updates.washingMachine = parseBoolean(washingMachine);
  if (heater !== undefined) updates.heater = parseBoolean(heater);
  if (bathtub !== undefined) updates.bathtub = parseBoolean(bathtub);
  if (internetAccess !== undefined)
    updates.internetAccess = parseBoolean(internetAccess);
  if (coffeeTea !== undefined) updates.coffeeTea = parseBoolean(coffeeTea);
  if (privatePool !== undefined)
    updates.privatePool = parseBoolean(privatePool);
  if (airConditioning !== undefined)
    updates.airConditioning = parseBoolean(airConditioning);
  if (fan !== undefined) updates.fan = parseBoolean(fan);
  if (sofa !== undefined) updates.sofa = parseBoolean(sofa);
  if (chairs !== undefined) updates.chairs = parseBoolean(chairs);
  if (bed !== undefined) updates.bed = parseBoolean(bed);

  await room.update(updates);

  res.status(200).json({
    status: 'success',
    room,
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
    message: 'Room deleted successfully',
  });
});

exports.getRoomsByType = catchAsync(async (req, res) => {
  const { roomType } = req.query;

  const where = {
    roomType: {
      [Op.like]: `%${roomType}%`,
    },
  };

  // If user is guest, only show available rooms
  if (req.user.role !== 'admin') {
    where.available = true;
  }

  const rooms = await Room.findAll({ where });

  res.status(200).json({
    status: 'success',
    userType: req.user.role === 'admin' ? 'admin' : 'guest',
    results: rooms.length,
    rooms,
  });
});

exports.getRoomsByPriceRange = catchAsync(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  const where = {};
  if (minPrice)
    where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
  if (maxPrice)
    where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };

  // If user is guest, only show available rooms
  if (req.user.role !== 'admin') {
    where.available = true;
  }

  const rooms = await Room.findAll({ where });

  res.status(200).json({
    status: 'success',
    userType: req.user.role === 'admin' ? 'admin' : 'guest',
    results: rooms.length,
    rooms,
  });
});

exports.getRoomsByTypeAndPriceRange = catchAsync(async (req, res) => {
  const { roomType, minPrice, maxPrice } = req.query;

  const where = {
    roomType: {
      [Op.like]: `%${roomType}%`,
    },
  };

  if (minPrice)
    where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
  if (maxPrice)
    where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };

  // If user is guest, only show available rooms
  if (req.user.role !== 'admin') {
    where.available = true;
  }

  const rooms = await Room.findAll({ where });

  res.status(200).json({
    status: 'success',
    userType: req.user.role === 'admin' ? 'admin' : 'guest',
    results: rooms.length,
    rooms,
  });
});

exports.getRoomsByAvailability = catchAsync(async (req, res) => {
  const { available } = req.query;

  const rooms = await Room.findAll({
    where: {
      available: available === 'true' || available === true,
    },
  });

  // If user is guest, only return available rooms
  const filteredRooms =
    req.user.role !== 'admin'
      ? rooms.filter((room) => room.available === true)
      : rooms;

  res.status(200).json({
    status: 'success',
    userType: req.user.role === 'admin' ? 'admin' : 'guest',
    results: filteredRooms.length,
    rooms: filteredRooms,
  });
});

exports.getRoomsByTypeAndAvailability = catchAsync(async (req, res) => {
  const { roomType, available } = req.query;

  const where = {
    roomType: {
      [Op.like]: `%${roomType}%`,
    },
  };

  // If user is guest, only show available rooms
  if (req.user.role !== 'admin') {
    where.available = true;
  } else {
    // Admin can filter by availability if specified
    if (available !== undefined) {
      where.available = available === 'true' || available === true;
    }
  }

  const rooms = await Room.findAll({ where });

  res.status(200).json({
    status: 'success',
    userType: req.user.role === 'admin' ? 'admin' : 'guest',
    results: rooms.length,
    rooms,
  });
});

// Book a room and store booking details in database
exports.bookRoom = catchAsync(async (req, res, next) => {
  const {
    checkInDate,
    checkOutDate,
    roomId,
    selectedFeatures,
    guestId: guestIdFromBody,
  } = req.body;

  // Step 1: Validate all required fields
  if (!checkInDate || !checkOutDate || !roomId) {
    return next(
      new AppError('Please provide checkInDate, checkOutDate, and roomId', 400),
    );
  }

  // Determine guestId from token for guest users. Admin may pass guestId explicitly.
  let guestId = req.user?.id;
  if (req.user && req.user.role === 'admin') {
    guestId = guestIdFromBody;
  }

  if (!guestId) {
    return next(
      new AppError(
        'Please provide guestId for admin booking or login as a guest',
        400,
      ),
    );
  }

  // Step 2: Validate dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return next(new AppError('Invalid date format', 400));
  }

  if (checkIn >= checkOut) {
    return next(
      new AppError('Check-out date must be after check-in date', 400),
    );
  }

  // Step 3: Verify room exists and get room details
  const room = await Room.findByPk(roomId);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Prevent booking rooms that are not currently available
  if (!room.available) {
    return next(new AppError('Room is not available for booking', 409));
  }

  // Step 4: Check if room is already booked for the selected dates
  const conflictingBooking = await Booking.findOne({
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
      new AppError(
        'Room is not available for the selected dates. Please choose different dates.',
        409,
      ),
    );
  }

  // Step 5: Calculate booking details
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const nightlyRate = room.price;
  const totalPrice = nightlyRate * nights;

  // If guest provided selectedFeatures, keep them for booking metadata
  const selectedFeaturesData = selectedFeatures
    ? selectedFeatures
    : {
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
      };

  // Step 6: Create booking record in database with all details
  const booking = await Booking.create({
    checkInDate,
    checkOutDate,
    roomId,
    guestId,
    nightlyRate,
    totalPrice,
    selectedFeatures: selectedFeaturesData,
    status: 'booked',
  });

  // Step 7: Update room availability status after booking is confirmed
  await room.update({
    available: false,
  });

  // Step 8: Return complete booking confirmation
  res.status(201).json({
    status: 'success',
    message: 'Room booked successfully and saved to bookings database',
    booking: {
      bookingId: booking.id,
      roomDetails: {
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
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
      },
      guestId: booking.guestId,
      selectedFeatures: booking.selectedFeatures,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      numberOfNights: nights,
      nightlyRate: booking.nightlyRate,
      totalPrice: booking.totalPrice,
      bookingStatus: booking.status,
      roomAvailabilityUpdated: !room.available,
      bookingCreatedAt: booking.createdAt,
    },
  });
});

// Get available rooms for a date range
exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  const { checkInDate, checkOutDate } = req.query;

  // Validate dates are provided
  if (!checkInDate || !checkOutDate) {
    return next(
      new AppError('Please provide checkInDate and checkOutDate', 400),
    );
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn >= checkOut) {
    return next(
      new AppError('Check-out date must be after check-in date', 400),
    );
  }

  // Find all bookings that overlap with the requested dates
  const bookedRoomIds = await Booking.findAll({
    where: {
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
    attributes: ['roomId'],
    raw: true,
  });

  const bookedIds = bookedRoomIds.map((b) => b.roomId);

  // Build where clause - exclude booked rooms
  const where = {
    id: {
      [Op.notIn]: bookedIds.length > 0 ? bookedIds : [0],
    },
  };

  // If user is guest, only show rooms marked as available
  if (req.user.role !== 'admin') {
    where.available = true;
  }

  // Get rooms that are not booked
  const availableRooms = await Room.findAll({ where });

  res.status(200).json({
    status: 'success',
    userType: req.user.role === 'admin' ? 'admin' : 'guest',
    checkInDate,
    checkOutDate,
    results: availableRooms.length,
    message:
      req.user.role !== 'admin'
        ? 'Available rooms for booking'
        : 'All rooms not booked for this period',
    rooms: availableRooms,
  });
});

// ADMIN ONLY: Release room availability after guest checkout
exports.releaseRoomAfterCheckout = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find the room
  const room = await Room.findByPk(id);
  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  // Mark room as available for new bookings
  await room.update({
    available: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Room has been cleared and is now available for booking',
    room: {
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      available: room.available,
      updatedAt: room.updatedAt,
    },
  });
});
