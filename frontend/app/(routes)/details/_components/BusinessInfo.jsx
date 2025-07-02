import { Button } from '@/components/ui/button'
import { Clock, Mail, MapPin, Share, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function BusinessInfo({ business }) {
  // Demo data for business
  const demoBusiness = {
    name: 'ABC Cleaning Services',
    category: { name: 'Home Services' },
    address: '123 Main St, City, Country',
    email: 'contact@abccleaning.com',
    contactPerson: 'John Doe',
    images: [{ url: '/path/to/demo-image1.jpg' }],
  };

  // Use demo data if business prop is not available
  const currentBusiness = business || demoBusiness;

  return currentBusiness?.name && (
    <div className='md:flex gap-4 items-center'>
      <Image 
        src={currentBusiness?.images[0]?.url}
        alt={currentBusiness.name}
        width={150}
        height={200}
        className='rounded-full h-[150px] object-cover'
      />
      <div className='flex justify-between items-center w-full'>
        <div className='flex flex-col mt-4 md:mt-0 items-baseline gap-3'>
          <h2 className='text-primary p-1 px-3 text-lg bg-purple-100 rounded-full'>
            {currentBusiness?.category?.name}
          </h2>
          <h2 className='text-[40px] font-bold'>{currentBusiness.name}</h2>
          <h2 className='flex gap-2 text-lg text-gray-500'>
            <MapPin /> {currentBusiness.address}
          </h2>
          <h2 className='flex gap-2 text-lg text-gray-500'>
            <Mail />
            {currentBusiness?.email}
          </h2>
        </div>
        <div className='flex flex-col gap-5 items-end'>
          <Button><Share /></Button>
          <h2 className='flex gap-2 text-xl text-primary'>
            <User /> {currentBusiness.contactPerson}
          </h2>
          <h2 className='flex gap-2 text-xl text-gray-500'>
            <Clock /> Available 8:00 AM to 10:00 PM
          </h2>
        </div>
      </div>
    </div>
  );
}

export default BusinessInfo;
