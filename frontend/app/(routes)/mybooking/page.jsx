"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingHistoryList from './_component/BookingHistoryList'
import moment from 'moment'

function MyBooking() {

    // Demo data for bookings
    const demoBookings = [
        {
            id: 1,
            service: "Plumbing Repair",
            date: "2025-04-15T14:00:00Z", // Example future date for 'booked'
            status: "booked",
            provider: "Doe's Plumbing",
            location: "1234 Elm Street, Springfield",
            customer: "John Doe",
            phone: "+1 (555) 123-4567"
        },
        {
            id: 2,
            service: "Home Cleaning",
            date: "2025-04-10T10:00:00Z", // Example past date for 'completed'
            status: "completed",
            provider: "CleanSweep",
            location: "5678 Oak Avenue, Springfield",
            customer: "Jane Smith",
            phone: "+1 (555) 234-5678"
        },
        {
            id: 3,
            service: "Electrical Repair",
            date: "2025-04-12T16:00:00Z", // Example past date for 'completed'
            status: "completed",
            provider: "SparkFix Electrical",
            location: "910 Maple Drive, Springfield",
            customer: "David Brown",
            phone: "+1 (555) 345-6789"
        },
        {
            id: 4,
            service: "Roof Repair",
            date: "2025-04-20T09:00:00Z", // Example future date for 'booked'
            status: "booked",
            provider: "RoofMasters",
            location: "2468 Pine Road, Springfield",
            customer: "Alice White",
            phone: "+1 (555) 456-7890"
        }
    ];

    const [bookingHistory, setBookingHistory] = useState(demoBookings);

    const filterData = (type) => {
        const result = bookingHistory.filter(item =>
            type === 'booked' ?
                new Date(item.date) >= new Date() // Show future bookings for 'booked'
                : new Date(item.date) <= new Date()); // Show past bookings for 'completed'

        return result;
    }

    return (
        <div className='my-10 mx-5 md:mx-36'>
            <h2 className='font-bold text-[20px] my-2'>My Bookings</h2>
            <Tabs defaultValue="booked" className="w-full">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="booked">Booked</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="booked">
                    <BookingHistoryList 
                        bookingHistory={filterData('booked')}
                        type='booked'
                    />
                </TabsContent>
                <TabsContent value="completed">
                    <BookingHistoryList 
                        bookingHistory={filterData('completed')}
                        type='completed'
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MyBooking
