import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

function BookingHistoryList({ bookingHistory, type }) {
  // Demo booking data (replace with actual data when connected to backend)
  const demoBookingHistory = [
    {
      id: '1',
      date: '2025-04-20',
      time: '10:00 AM',
      businessList: {
        name: 'ABC Cleaning Services',
        contactPerson: 'John Doe',
        address: '123 Main St, City, Country',
        images: [{ url: '/path/to/demo-image1.jpg' }],
      }
    },
    {
      id: '2',
      date: '2025-04-22',
      time: '2:00 PM',
      businessList: {
        name: 'XYZ Plumbing Services',
        contactPerson: 'Jane Smith',
        address: '456 Maple St, City, Country',
        images: [{ url: '/path/to/demo-image2.jpg' }],
      }
    }
  ];

  const [bookingHistoryData, setBookingHistoryData] = useState([]);

  useEffect(() => {
    // Here, you would typically fetch data from an API. For now, we'll use demo data.
    setBookingHistoryData(demoBookingHistory);
  }, []);

  const cancelAppointment = (booking) => {
    // Instead of calling API, just show a toast for now.
    toast('Booking Deleted Successfully!');
    // Here, you could also filter out the canceled booking from the list if needed
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {bookingHistoryData.map((booking, index) => (
        <div key={index} className='border rounded-lg p-6 mb-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out'>
          <div className='flex gap-6'>
            {booking?.businessList?.name &&
              <Image
                src={booking?.businessList?.images[0]?.url}
                alt='Provider Image'
                width={120}
                height={120}
                className='rounded-lg object-cover'
              />
            }
            <div className='flex flex-col gap-4'>
              <h2 className='font-semibold text-2xl text-gray-800'>{booking.businessList.name}</h2>
              <div className='flex items-center gap-2 text-primary'>
                <User className='text-lg' />
                <span className='text-lg'>{booking.businessList.contactPerson}</span>
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <MapPin className='text-primary' />
                <span className='text-lg'>{booking.businessList.address}</span>
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <Calendar className='text-primary' />
                <span className='font-medium text-lg'>Service on: <span className='text-black'>{booking.date}</span></span>
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <Clock className='text-primary' />
                <span className='font-medium text-lg'>Time: <span className='text-black'>{booking.time}</span></span>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-6 w-full border-red-300 hover:bg-red-50 text-red-500 font-semibold text-lg py-3 transition-all duration-200 ease-in-out"
              >
                Cancel Appointment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className='font-semibold text-xl text-gray-800'>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-lg text-gray-600'>
                  This action cannot be undone. Your booking will be permanently canceled.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-gray-500 font-medium">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => cancelAppointment(booking)}
                  className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition-all duration-200 ease-in-out"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      ))}
    </div>
  )
}

export default BookingHistoryList
