import React, { useEffect, useState } from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import moment from 'moment';

function BookingSection({ children, business }) {

  // Demo data for business
  const demoBusiness = {
    id: '1',
    name: 'ABC Cleaning Services',
    category: { name: 'Home Services' },
  };

  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTime, setSelectedTime] = useState();
  const [bookedSlot, setBookedSlot] = useState([]);

  // Use demo business if business prop is not available
  const currentBusiness = business || demoBusiness;

  useEffect(() => {
    getTime();
  }, []);

  useEffect(() => {
    date && BusinessBookedSlot();
  }, [date]);

  /**
   * Simulating BusinessBookedSlot with demo data
   */
  const BusinessBookedSlot = () => {
    const demoBookedSlots = [
      { time: '10:00 AM' },
      { time: '11:30 AM' },
    ];
    setBookedSlot(demoBookedSlots);
  }

  const getTime = () => {
    const timeList = [];
    for (let i = 10; i <= 12; i++) {
      timeList.push({
        time: i + ':00 AM'
      });
      timeList.push({
        time: i + ':30 AM'
      });
    }
    for (let i = 1; i <= 6; i++) {
      timeList.push({
        time: i + ':00 PM'
      });
      timeList.push({
        time: i + ':30 PM'
      });
    }
    setTimeSlot(timeList);
  }

  const saveBooking = () => {
    // Simulating API call to save booking
    setDate();
    setSelectedTime('');
    toast('Service Booked successfully!');
  }

  const isSlotBooked = (time) => {
    return bookedSlot.find(item => item.time === time);
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Book a Service</SheetTitle>
            <SheetDescription>
              Select Date and Time slot to book a service
              {/* Date Picker  */}
              <div className='flex flex-col gap-5 items-baseline'>
                <h2 className='mt-5 font-bold'>Select Date</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              {/* Time Slot Picker  */}
              <h2 className='my-5 font-bold'>Select Time Slot</h2>
              <div className='grid grid-cols-3 gap-3'>
                {timeSlot.map((item, index) => (
                  <Button
                    key={index}
                    disabled={isSlotBooked(item.time)}
                    variant='outline'
                    className={`border rounded-full 
                      p-2 px-3 hover:bg-primary
                      hover:text-white
                      ${selectedTime === item.time && 'bg-primary text-white'}`}
                    onClick={() => setSelectedTime(item.time)}
                  >
                    {item.time}
                  </Button>
                ))}
              </div>
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="mt-5">
            <SheetClose asChild>
              <div className='flex gap-5'>
                <Button variant="destructive" className="">Cancel</Button>
                <Button
                  disabled={!(selectedTime && date)}
                  onClick={() => saveBooking()}
                >
                  Book
                </Button>
              </div>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default BookingSection;
