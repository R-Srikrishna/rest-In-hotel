const Guest = require('../models/guestModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const filterObj = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  );

const sanitizeGuest = (guestInstance) => {
  const g = guestInstance.toJSON
    ? guestInstance.toJSON()
    : { ...guestInstance };
  if (g.password) delete g.password;
  return g;
};

const sendWelcomeEmail = async (toEmail, firstName) => {
  // Do not send plaintext passwords. This sends a simple welcome message only.
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  )
    return;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Welcome to Rest-Inn',
    text: `Hi ${firstName || ''},\n\nWelcome to Rest-Inn! Your account has been created successfully.\n\nYou can log in using your email and the password you set during signup. If you forgot your password, use the password reset flow to securely set a new one.\n\nRegards,\nRest-Inn Team`,
  };

  await transporter.sendMail(message);
};

exports.getGuests = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query, { where: {} })
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const guests = await Guest.findAll(features.options);

  const sanitized = guests.map(sanitizeGuest);

  res.status(200).json({
    status: 'success',
    results: sanitized.length,
    guests: sanitized,
  });
});

exports.createGuest = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    country,
    nationality,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !gender ||
    !country ||
    !nationality
  ) {
    return next(
      new AppError(
        'Please provide firstName,lastName,email,password,phoneNumber,gender,country,nationality',
        400,
      ),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const guest = await Guest.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    gender,
    country,
    nationality,
  });

  const guestData = sanitizeGuest(guest);

  // send welcome email (no plaintext password)
  try {
    await sendWelcomeEmail(email, firstName);
  } catch (err) {
    // don't block creation on email failure
    console.error('Welcome email failed:', err.message);
  }

  res.status(201).json({
    status: 'success',
    guest: guestData,
  });
});

exports.updateGuest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    country,
    nationality,
  } = req.body;

  const guest = await Guest.findByPk(id);

  if (!guest) {
    return next(new AppError('Guest not found', 404));
  }

  if (firstName !== undefined) guest.firstName = firstName;
  if (lastName !== undefined) guest.lastName = lastName;
  if (email !== undefined) guest.email = email;
  if (phoneNumber !== undefined) guest.phoneNumber = phoneNumber;
  if (gender !== undefined) guest.gender = gender;
  if (country !== undefined) guest.country = country;
  if (nationality !== undefined) guest.nationality = nationality;

  await guest.save(); // <-- Required

  const guestData = sanitizeGuest(guest);

  res.status(200).json({
    status: 'success',
    guest: guestData,
  });
});

exports.deleteGuest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const guest = await Guest.findByPk(id);
  if (!guest) {
    return next(new AppError('Guest not found', 404));
  }

  await guest.destroy();

  res.status(200).json({
    status: 'success',
    message: 'Guest deleted successfully',
  });
});

exports.getGuestById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const guest = await Guest.findByPk(id);
  if (!guest) {
    return next(new AppError('Guest not found', 404));
  }

  const guestData = sanitizeGuest(guest);

  res.status(200).json({
    status: 'success',
    guest: guestData,
  });
});
