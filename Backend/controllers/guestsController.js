const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Guest = require('../models/guestModel');
const Booking = require('../models/bookingModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Helper: Sign JWT Token for Guests
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// Helper: Send Token Response
const createSendToken = (guest, statusCode, res) => {
  const token = signToken(guest.id);

  const guestData = guest.toJSON ? guest.toJSON() : { ...guest };
  delete guestData.password;
  delete guestData.verificationToken;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      guest: guestData,
    },
  });
};

// =============================================================================
// 🟢 GUEST AUTHENTICATION & SELF-SERVICE
// =============================================================================

// 1. Guest Registration
exports.guestSignup = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    nationality,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return next(new AppError('Please fill in all required fields.', 400));
  }

  const existingGuest = await Guest.findOne({ where: { email } });
  if (existingGuest) {
    return next(
      new AppError('An account with this email already exists.', 400),
    );
  }

  // Password hashing is typically handled via Sequelize pre-save hooks
  const newGuest = await Guest.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    nationality,
  });

  createSendToken(newGuest, 201, res);
});

// 2. Guest Login
exports.guestLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const guest = await Guest.findOne({ where: { email } });
  if (!guest) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, guest.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  createSendToken(guest, 200, res);
});

// 3. Guest Protect Middleware (Authentication)
exports.protectGuest = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to gain access.', 401),
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentGuest = await Guest.findByPk(decoded.id);

  if (!currentGuest) {
    return next(
      new AppError('The guest belonging to this token no longer exists.', 401),
    );
  }

  // Attach guest user context to req
  req.user = currentGuest;
  next();
});

// 4. Guest View Profile
exports.getMe = catchAsync(async (req, res, next) => {
  const guest = await Guest.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'verificationToken'] },
  });

  res.status(200).json({
    status: 'success',
    data: { guest },
  });
});

// 5. Guest Update Self Profile
exports.updateMe = catchAsync(async (req, res, next) => {
  // Disallow password updates through this route
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400,
      ),
    );
  }

  const allowedFields = [
    'firstName',
    'lastName',
    'phoneNumber',
    'gender',
    'nationality',
  ];
  const filteredBody = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  const updatedGuest = await req.user.update(filteredBody);

  const guestData = updatedGuest.toJSON();
  delete guestData.password;
  delete guestData.verificationToken;

  res.status(200).json({
    status: 'success',
    data: { guest: guestData },
  });
});

// =============================================================================
// 🔴 ADMIN & SUPER-ADMIN GUEST MANAGEMENT
// =============================================================================

// 6. Admin: Get List of All Guests
exports.getAllGuests = catchAsync(async (req, res, next) => {
  const guests = await Guest.findAll({
    attributes: { exclude: ['password', 'verificationToken'] },
  });

  res.status(200).json({
    status: 'success',
    results: guests.length,
    data: { guests },
  });
});

// 7. Admin: Get Single Guest Details (Including booking history)
exports.getGuestById = catchAsync(async (req, res, next) => {
  const guest = await Guest.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'verificationToken'] },
    include: [{ model: Booking }],
  });

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { guest },
  });
});

// 8. Admin: Create Guest Account Manually
exports.createGuest = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    nationality,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !gender ||
    !nationality
  ) {
    return next(new AppError('Please fill required details to continue', 400));
  }

  const existingGuest = await Guest.findOne({ where: { email } });
  if (existingGuest) {
    return next(new AppError('A guest with this email already exists', 400));
  }

  const newGuest = await Guest.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    nationality,
  });

  const guestData = newGuest.toJSON();
  delete guestData.password;
  delete guestData.verificationToken;

  res.status(201).json({
    status: 'success',
    data: { guest: guestData },
  });
});

// 9. Admin: Update Guest Details
exports.updateGuest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const guest = await Guest.findByPk(id);

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  if (Object.keys(req.body).length === 0) {
    return next(
      new AppError('Please provide at least one field to update', 400),
    );
  }

  // Handle email collision
  if (req.body.email && req.body.email !== guest.email) {
    const existingGuest = await Guest.findOne({
      where: { email: req.body.email },
    });
    if (existingGuest) {
      return next(
        new AppError('Another guest is already using this email', 400),
      );
    }
  }

  // Prevent plain text password overwrite
  if (req.body.password) {
    delete req.body.password;
  }

  await guest.update(req.body);

  const updatedGuest = guest.toJSON();
  delete updatedGuest.password;
  delete updatedGuest.verificationToken;

  res.status(200).json({
    status: 'success',
    data: { guest: updatedGuest },
  });
});

// 10. Admin: Delete Guest
exports.deleteGuest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const guest = await Guest.findByPk(id);

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  // Safety check for active bookings
  const activeBookings = await Booking.findOne({
    where: {
      guestId: id,
      status: ['confirmed', 'checked-in'],
    },
  });

  if (activeBookings) {
    return next(
      new AppError(
        'Cannot delete guest with active or ongoing bookings. Resolve bookings first.',
        400,
      ),
    );
  }

  await guest.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
