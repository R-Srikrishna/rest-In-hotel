const Room = require('../models/roomModel')

const getRooms = async(req,res)=>{
    try{
        const rooms = await Room.findAll();
        res.json(rooms);
        console.log(rooms);
       }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports = {
    getRooms
}