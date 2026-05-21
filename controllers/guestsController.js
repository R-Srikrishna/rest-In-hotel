const Guest = require('../models/guestModel')

const getGuests = async(req,res)=>{
    try{
        const guests = await Guest.findAll();
        res.json;
    }catch(err){
        res.status(500).json({message:err.message})
    }
    }
    module.exports ={
        getGuests
    }