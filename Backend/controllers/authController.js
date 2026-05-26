const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Guest = require('../models/guestModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
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
      guest: guestData
    }
  });
};

exports.signup = catchAsync(async (req,res,next)=>{
    const {firstName,lastName,email,password,phoneNumber,gender,country,nationality} = req.body;

    const hashedPassword = await bcrypt.hash(password,12);

    const guest = await Guest.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        phoneNumber,
        gender,
        country,
        nationality
    })

    createSendToken(guest,201,res)
})

exports.login = catchAsync(async (req,res,next)=>{
    const {email,password} = req.body;
    const guest = await Guest.findOne({where:{email}});

    if(!guest){
        return next(new AppError('Incorrect email or password',401));
    }

    const isPasswordCorrect = await bcrypt.compare(password,guest.password);

    if(!isPasswordCorrect){
        return next(new AppError('Incorrect email or password',401))
    }

    createSendToken(guest,200,res)
})

exports.protect = catchAsync(async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('You are not logged in',401))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    const guest = await Guest.findByPk(decoded.id);

    if(!guest){
        return next(new AppError('The user belonging to this token does no longer exist',401))
    }

    req.user = guest;
    next();
})
