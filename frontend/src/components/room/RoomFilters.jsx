import React from 'react'

const RoomFilters = ({
  status,
  setStatus,
  type,
  setType
}) => {
  return (
    <div className="flex gap-4 mb-4">

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Status</option>
        <option value="Available">Available</option>
        <option value="Booked">Booked</option>
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Types</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Suite">Suite</option>
      </select>

    </div>
  )
}

export default RoomFilters