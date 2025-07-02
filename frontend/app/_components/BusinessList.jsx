import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import img from "../default_provider.png";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
};

const loadingVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 0.7,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

function BusinessList({ businessList = [], title }) {
  const getImageSource = (profilePicture) => {
    if (!profilePicture) {
      return img;
    }
    
    try {
      // Remove any accidental double slashes
      const cleanedPath = profilePicture.replace(/([^:]\/)\/+/g, '$1');
      
      // Check if it's already a full URL
      if (profilePicture.startsWith('http')) {
        return profilePicture;
      }
      
      // Handle local paths
      if (profilePicture.startsWith('/uploads/')) {
        return `http://localhost:5000${cleanedPath}`;
      }
      
      return img;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return img;
    }
  };

  return (
    <div className="mt-8">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
      >
        {title}
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6"
        initial="hidden"
        animate="visible"
      >
        {businessList.length > 0 ? (
          businessList.map((business, index) => (
            <motion.div
              key={business._id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="relative"
            >
              <Link href={`/provider/${business._id}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={getImageSource(business.profilePicture)}
                      alt={business.businessName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 4}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = img.src;
                      }}
                    />
                    {business.isVerified && (
                      <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                      {business.availability || "Available"}
                    </div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {business.serviceCategory}
                      </span>
                      <div className="flex items-center text-sm bg-yellow-50 px-2 py-1 rounded">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{business.rating || "4.5"}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                      {business.businessName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{business.name}</p>

                    <div className="flex items-center text-gray-500 text-sm mt-auto mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">{business.businessAddress}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{business.experience || "2+ years"} experience</span>
                    </div>

                    <Button className="w-full mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          Array(4).fill().map((_, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={loadingVariants}
              className="bg-gray-100 rounded-xl overflow-hidden h-[350px]"
              animate="visible"
            >
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded mt-6 animate-pulse"></div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default BusinessList;