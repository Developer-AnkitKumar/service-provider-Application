import { Button } from '@/components/ui/button'
import { NotebookPen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import BookingSection from './BookingSection';

function SuggestedBusinessList({ business }) {
  
  // Demo data for similar businesses
  const demoBusinessList = [
    {
      id: '2',
      name: 'XYZ Plumbing Services',
      contactPerson: 'Jane Smith',
      address: '456 Maple St, City, Country',
      images: [{ url: '/path/to/demo-image2.jpg' }],
    },
    {
      id: '3',
      name: 'LMN Electrical Services',
      contactPerson: 'David Green',
      address: '789 Oak St, City, Country',
      images: [{ url: '/path/to/demo-image3.jpg' }],
    },
    {
      id: '4',
      name: 'PQR Gardening Services',
      contactPerson: 'Emily White',
      address: '101 Pine St, City, Country',
      images: [{ url: '/path/to/demo-image4.jpg' }],
    },
  ];

  const [businessList, setBusinessList] = useState([]);

  useEffect(() => {
    // Set demo data instead of calling an external API
    if (business) {
      setBusinessList(demoBusinessList);  // Use demo business list directly
    }
  }, [business]);

  return (
    <div className='md:pl-10'>
      <BookingSection business={business}>
        <Button className="flex gap-2 w-full">
          <NotebookPen />
          Book Appointment  
        </Button> 
      </BookingSection>
      
      <div className='hidden md:block'>
        <h2 className='font-bold text-lg mt-3 mb-3'>Similar Business</h2>
        <div className=''>
          {businessList && businessList.map((business, index) => (
            <Link 
              key={index}
              href={'/details/' + business.id} 
              className="flex gap-2 mb-4 hover:border rounded-lg p-2 cursor-pointer hover:shadow-md border-primary"
            >
              <Image 
                src={business?.images[0].url}
                alt={business.name}
                width={80}
                height={80}
                className='rounded-lg object-cover h-[100px]'
              />
              <div className=''>
                <h2 className='font-bold'>{business.name}</h2>
                <h2 className='text-primary'>{business.contactPerson}</h2>
                <h2 className='text-gray-400'>{business.address}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuggestedBusinessList;
