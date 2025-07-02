import Navbar from '@/app/_provider_components/Navbar'
import Sidebar  from '@/app/_provider_components/Sidebar'
import React from 'react'
import Bookings from '../_provider_components/Bookings'

function page() {
  return (
    <>
    <Navbar/>
    <Sidebar/>
    <Bookings/>
    </>
  )
}

export default page