const bcrypt = require('bcryptjs');
const Guest = require('../models/guestModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');


const filterObj = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));

exports.getGuests = catchAsync(async (req,res,next)=>{
  const features = new APIFeatures(req,query,{where:{}})
  .filter()
  .sort()
  .limitFields()
  .paginate();

  const guests = await Guest.findAll(features.optnios)

  res.status(200).json({
    status:'success',
    results:guests.length,
    guests
  })
})

exports.getUsers = exports.getGuests;

exports.createGuest = catchAsync(async(req,res,next)=>{
  const {firstName,lastName,email,password,phoneNumber,gender,country,nationality} = req.body;
  
  if(!firstName || !lastName || !email || !password || !phoneNumber || !gender || !country || !nationality){
    return next(new AppError('Please provide firstName,lastName,email,password,phoneNumber,gender,country,nationality',400));
  }

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

  res.status(201).json({
    status:'success',
    guests
  })
})

exports.updateGuests = catchAsync(async(req,res,next)=>{
  const {id}=req.params;
  const {firstName,lastName,email,password,phoneNumber,gender,country,nationality} = req.body;

  const guest = await Guest.findByPk(id);
  if(!guest){
    return next(new AppError('Guest not found',404))
  }

  guest.firstName = firstName;
  guest.lastName = lastName;
  guest.email = email;
  guest.password = password;
  guest.phoneNumber = phoneNumber;
  guest.gender = gender;
  guest.country= country;
  guest.nationality= nationality;
  
  await guest.save();
  
  res.status(200).json({
    status:'success',
    guest
  })
})

exports.deleteGuest = catchAsync(async(req,res,next)=>{
  const {id} = req.params

  const guest = await Guest.findByPk(id);
  if(!guest){
    return next(new AppError('Guest not found',404))
  }

  await guest.destroy();

  res.status(200).json({
    status:'success',
    message:'Guest deleted successfully'
  })
})

exports.getGuestById = catchAsync(async(req,res,next)=>{
  const {id} = req.params;

  const guest = await Guest.findByPk(id)
  if(!guest){
    return next(new AppError('Guest not found',404))
  }

  res.status(200).json({
    status:'success',
    guest
  })
})