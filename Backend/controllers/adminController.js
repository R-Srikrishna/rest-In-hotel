const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Admin = require('../models/adminModel');
const Guest = require('../models/guestModel');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Generates a JWT token using the admin ID and secret
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// Formats user data, signs a token, and sends a JSON authentication response
const createSendToken = (admin, statusCode, res) => {
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

// Handles admin and super-admin login requests by validating credentials
exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const admin = await Admin.findOne({ where: { email } });

  if (!admin) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(admin, 200, res);
});

// Middleware to verify the JWT token and protect protected admin routes
exports.protectAdmin = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(' You are not logged in. Please log in to get access.', 401),
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentAdmin = await Admin.findByPk(decoded.id);

  if (!currentAdmin) {
    return next(
      new AppError('The admin belonging to this token no longer exists.', 401),
    );
  }

  req.admin = currentAdmin;
  next();
});

// Middleware to restrict access based on specified user roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

// Retrieves a list of all registered admin accounts excluding passwords
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.findAll({
    attributes: { exclude: ['password'] },
  });

  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: { admins },
  });
});

// Creates a new admin account with hashed password credentials
exports.createAdmin = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return next(
      new AppError(
        'Please provide firstName, lastName, email, and password for the new admin',
        400,
      ),
    );
  }

  const existingAdmin = await Admin.findOne({ where: { email } });
  if (existingAdmin) {
    return next(
      new AppError('An admin account with this email already exists', 400),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newAdmin = await Admin.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || 'admin',
  });

  const adminData = newAdmin.toJSON();
  delete adminData.password;

  res.status(201).json({
    status: 'success',
    data: {
      admin: adminData,
    },
  });
});

// Updates administrative details for an existing admin account
exports.updateAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, role, password } = req.body;

  const adminToUpdate = await Admin.findByPk(id);

  if (!adminToUpdate) {
    return next(new AppError('No admin found with that ID', 404));
  }

  if (email && email !== adminToUpdate.email) {
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return next(new AppError('An admin with this email already exists', 400));
    }
  }

  if (firstName !== undefined) adminToUpdate.firstName = firstName;
  if (lastName !== undefined) adminToUpdate.lastName = lastName;
  if (email !== undefined) adminToUpdate.email = email;
  if (role !== undefined) adminToUpdate.role = role;

  if (password) adminToUpdate.password = password;

  await adminToUpdate.save();

  const adminData = adminToUpdate.toJSON();
  delete adminData.password;

  res.status(200).json({
    status: 'success',
    data: {
      admin: adminData,
    },
  });
});

// Removes an admin account while preventing self-deletion
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const adminToDelete = await Admin.findByPk(req.params.id);

  if (!adminToDelete) {
    return next(new AppError('No admin found with that ID', 404));
  }

  if (adminToDelete.id === req.admin.id) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  await adminToDelete.destroy();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Retrieves a list of all guests excluding sensitive fields
exports.getGuests = catchAsync(async (req, res, next) => {
  const guests = await Guest.findAll({
    attributes: { exclude: ['password', 'verificationToken'] },
  });

  res.status(200).json({
    status: 'success',
    results: guests.length,
    data: { guests },
  });
});

// Creates a new guest record with hashed credentials
exports.createGuests = catchAsync(async (req, res, next) => {
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

  const hashedPassword = await bcrypt.hash(password, 12);

  const newGuest = await Guest.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
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

// Updates profile information for an existing guest account
exports.updateGuest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, gender, nationality } =
    req.body;

  const guest = await Guest.findByPk(id);

  if (!guest) {
    return next(new AppError('No guest found with that ID', 404));
  }

  if (Object.keys(req.body).length === 0) {
    return next(
      new AppError('Please provide at least one field to update', 400),
    );
  }

  if (email && email !== guest.email) {
    const existingGuest = await Guest.findOne({ where: { email } });
    if (existingGuest) {
      return next(
        new AppError('Another guest is already using this email', 400),
      );
    }
  }

  if (req.body.password) {
    delete req.body.password;
  }

  await guest.update({
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    nationality,
  });

  const updatedGuest = guest.toJSON();
  delete updatedGuest.password;
  delete updatedGuest.verificationToken;

  res.status(200).json({
    status: 'success',
    data: { guest: updatedGuest },
  });
});

// Deletes a guest profile after verifying there are no active bookings
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
        'Cannot delete guest with active bookings. Please resolve bookings first.',
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

// Fetches all booking records along with associated guest and room details
exports.getBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.findAll({
    include: [
      { model: Guest, attributes: ['id', 'firstName', 'lastName', 'email'] },
      { model: Room, attributes: ['id', 'roomNumber', 'type', 'price'] },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
  });
});

// Creates a new room booking entry for a guest
exports.createBooking = catchAsync(async (req, res, next) => {
  const { guestId, roomId, checkInDate, checkOutDate, totalPrice, status } =
    req.body;

  if (!guestId || !roomId || !checkInDate || !checkOutDate || !totalPrice) {
    return next(
      new AppError('Please provide all required booking details', 400),
    );
  }

  const newBooking = await Booking.create({
    guestId,
    roomId,
    checkInDate,
    checkOutDate,
    totalPrice,
    status: status || 'confirmed',
  });

  res.status(201).json({
    status: 'success',
    data: { booking: newBooking },
  });
});

// Fetches a list of all available rooms
exports.getRooms = catchAsync(async (req, res, next) => {
  const rooms = await Room.findAll();

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    data: { rooms },
  });
});
