const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Guest = require('../models/guestModel');
const Admin = require('../models/adminModel');
const Booking = require('../models/bookingModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Generates a JWT token using the guest ID and secret
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// Formats guest data, signs a token, and sends a JSON authentication response
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

// Formats admin data, signs a token, and sends an authentication response
const createSendAdminToken = (admin, statusCode, res) => {
  const token = signToken(admin.id);

  const adminData = admin.toJSON ? admin.toJSON() : { ...admin };
  delete adminData.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin: adminData,
    },
  });
};

// Registers a new guest account after checking for existing email records
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

// Authenticates user credentials by checking admin accounts first and guest accounts second
exports.guestLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const admin = await Admin.findOne({ where: { email } });
  if (admin) {
    const isAdminPasswordCorrect = await bcrypt.compare(
      password,
      admin.password,
    );
    if (!isAdminPasswordCorrect) {
      return next(new AppError('Incorrect email or password.', 401));
    }

    return createSendAdminToken(admin, 200, res);
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

// Middleware to verify guest JWT token and attach user context to request
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

  req.user = currentGuest;
  next();
});

// Retrieves the profile information for the currently authenticated guest
exports.getMe = catchAsync(async (req, res, next) => {
  const guest = await Guest.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'verificationToken'] },
  });

  res.status(200).json({
    status: 'success',
    data: { guest },
  });
});

// Updates non-sensitive personal profile details for the logged-in guest
exports.updateMe = catchAsync(async (req, res, next) => {
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

// Retrieves a list of all guest accounts excluding passwords and sensitive tokens
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

// Retrieves detailed information for a single guest along with their booking history
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

// Allows administrators to manually register a new guest account
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

// Updates profile information of a specified guest account by admin
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

// Deletes a guest record after verifying there are no active bookings
exports.deleteGuest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const guest = await Guest.findByPk(id);

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

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
