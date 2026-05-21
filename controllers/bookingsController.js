const GuestModel = require('../models/guestModel')

const getBookings = async(req,res)=>{
    try{
        const guests = await GuestModel.findAll();
        res.status(200).json({
            message:"Bookings retrieved successfully"
        });
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
module.exports ={getBookings}