const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Guest = require('../models/guestModel');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const DEV_USERS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dev-data/data/user.json'), 'utf-8'),
);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

const createSendToken = (guest, statusCode, res) => {
  const token = signToken(guest.id);

  const guestData = guest.toJSON();
  delete guestData.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      guest: guestData,
    },
  });
};

// SIGNUP

exports.signup = catchAsync(async (req, res, next) => {
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

  // 1. Check if email exists
  const existingGuest = await Guest.findOne({ where: { email } });
  if (existingGuest) {
    return next(new AppError('Email already exists', 400));
  }

  // 2. Hash password and build verification asset

  const verificationToken = crypto.randomBytes(32).toString('hex');

  // 3. Persist Guest to DB (locked state)
  const guest = await Guest.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    country,
    nationality,
    isVerified: false,
    verificationToken,
  });

  // 4. Fire the email using SendGrid SMTP Relay
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp.sendgrid.net
      port: Number(process.env.EMAIL_PORT), // 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // "apikey"
        pass: process.env.EMAIL_PASS, // Your SendGrid API Key
      },
    });
    console.log(`Verification email successfully delivered...`);

    // FIX CHOSEN HERE: Changed from /guests/verify-email to /auth/verify-email to match your app.js
    const verificationUrl = `${req.protocol}://${req.get('host')}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM, // Must be verified in SendGrid dashboard
      to: email,
      subject: 'Verify your Rest-Inn Account ✔',
      text: `Hi ${firstName},\n\nPlease verify your account by clicking this link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #333;">Welcome to Rest-Inn, ${firstName}!</h2>
          <p>Thank you for signing up. Please click the button below to confirm your email address and activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Account</a>
          </div>
          <p style="font-size: 12px; color: #777;">If the button above does not work, copy and paste this URL into your browser:</p>
          <p style="font-size: 12px; color: #0066cc;">${verificationUrl}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Verification email successfully delivered via SendGrid to: ${email}`,
    );
  } catch (err) {
    console.error(
      'SendGrid mailing operation encountered a failure:',
      err.message,
    );
    // Note: We don't crash the request cycle, but the user remains unverified until a resend occurs
  }

  res.status(201).json({
    status: 'success',
    message:
      'Registration successful! Please check your email to verify your account.',
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  // Set default Next.js route address running on port 3001
  const nextAppUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001';

  if (!token) {
    return res.redirect(`${nextAppUrl}/login?status=missing`);
  }

  // Find the locked user profile
  const guest = await Guest.findOne({ where: { verificationToken: token } });

  if (!guest) {
    return res.redirect(`${nextAppUrl}/login?status=invalid`);
  }

  // Enforce 24-hour validation lifespan on registration tokens
  const tokenCreationTime = new Date(guest.createdAt).getTime();
  const currentTime = Date.now();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  if (currentTime - tokenCreationTime > twentyFourHoursInMs) {
    // Purge the expired unverified record to prevent DB bloat
    await guest.destroy();
    return res.redirect(`${nextAppUrl}/login?status=expired`);
  }

  // Update activation values
  guest.isVerified = true;
  guest.verificationToken = null;
  await guest.save();

  // Clear verification route redirect straight into Next.js dashboard/login interface
  res.redirect(`${nextAppUrl}/login?verified=true`);
});

// LOGIN

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const guest = await Guest.findOne({
    where: { email },
  });

  if (!guest) {
    const tempUser = DEV_USERS.find((user) => user.email === email);

    if (!tempUser || tempUser.password !== password) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(tempUser.id);

    return res.status(200).json({
      status: 'success',
      token,
      data: {
        guest: tempUser,
      },
    });
  }

  // Block unverified users from logging in
  if (!guest.isVerified) {
    return next(
      new AppError('Please verify your email address before logging in.', 401),
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, guest.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(guest, 200, res);
});

// PROTECT ROUTES

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  let user = await Guest.findByPk(decoded.id);

  if (!user) {
    user = DEV_USERS.find((u) => u.id === decoded.id);
  }

  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  req.user = user;

  next();
});

// ADMIN ONLY

exports.restrictToAdmin = (req, res, next) => {
  console.log('REQUEST URL:', req.originalUrl);
  console.log('USER:', req.user.email);
  console.log('ROLE:', req.user.role);

  if (req.user.role !== 'admin') {
    return next(
      new AppError('You are not authorized to access this route', 403),
    );
  }

  next();
};

// GET ALL GUESTS

exports.getGuests = catchAsync(async (req, res, next) => {
  const guests = await Guest.findAll();

  res.status(200).json({
    status: 'success',
    results: guests.length,
    data: {
      guests,
    },
  });
});

// GET ALL BOOKINGS

exports.getBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.findAll();

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

// GET ALL ROOMS

exports.getRooms = catchAsync(async (req, res) => {
  const rooms = await Room.findAll();

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    rooms,
  });
});
