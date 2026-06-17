import React from 'react'

const RoomCard = () => {
    const room={
        roomNumber:1,
        type:'Standard',
        price:100,
        status:'Available'
    }
  return (
    <div>
        <h3>{room.roomNumber}</h3>
        <p>Type:{room.type}</p>
        <p>Price:${room.price}</p>
        <p>Status:{room.status}</p>
    </div>
  )
}

export default RoomCard