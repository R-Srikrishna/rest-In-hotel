import React from 'react'

const Sidebar = () => {
    const {isAuthenticated} = useAuth()
    const {loading} = useAuth()
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar