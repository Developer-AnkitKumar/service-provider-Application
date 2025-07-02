"use client"
import React, { useEffect, useState } from 'react'
import BusinessInfo from '../_components/BusinessInfo';
import SuggestedBusinessList from '../_components/SuggestedBusinessList';
import BusinessDescription from '../_components/BusinessDescription';

function BusinessDetail({ params }) {
    const [business, setBusiness] = useState(null);

    const demoBusinessData = {
        id: '1',
        name: 'ABC Cleaning Services',
        contactPerson: 'John Doe',
        address: '123 Main St, City, Country',
        description: 'We provide top-quality cleaning services for homes and businesses.',
        images: [{ url: '/path/to/demo-image1.jpg' }],
    };

    const demoSuggestedBusinesses = [
        {
            id: '2',
            name: 'XYZ Plumbing Services',
            contactPerson: 'Jane Smith',
            address: '456 Maple St, City, Country',
            description: 'Expert plumbing services with fast response times.',
            images: [{ url: '/path/to/demo-image2.jpg' }],
        },
        {
            id: '3',
            name: 'LMN Electrical Services',
            contactPerson: 'David Green',
            address: '789 Oak St, City, Country',
            description: 'Reliable electrical services for homes and businesses.',
            images: [{ url: '/path/to/demo-image3.jpg' }],
        },
    ];

    useEffect(() => {
        params && setBusiness(demoBusinessData);
    }, [params]);

    return business && (
        <div className='py-8 md:py-20 px-10 md:px-36'>
            <BusinessInfo business={business} />

            <div className='grid grid-cols-3 mt-16'>
                <div className='col-span-3 md:col-span-2 order-last md:order-first'>
                    <BusinessDescription business={business} />
                </div>
                <div className=''>
                    <SuggestedBusinessList business={demoSuggestedBusinesses} />
                </div>
            </div>
        </div>
    );
}

export default BusinessDetail;
