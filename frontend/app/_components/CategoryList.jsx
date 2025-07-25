import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function CategoryList({ categoryList = [] }) {
  console.log("cat",categoryList)
  return (
    <div className="mx-4 md:mx-22 lg:mx-52 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categoryList.length > 0 ? (
        categoryList.map((category,ix) => (
          <Link href={`/services/${category.name}`} key={ix} className="flex flex-col items-center justify-center gap-2 bg-purple-50 p-5 rounded-lg cursor-pointer hover:scale-110 transition-all ease-in-out">
            <Image src={category.icon?.url || "/default-icon.png"} alt="icon" width={35} height={35} />
            <h2 className="text-primary">{category.name}</h2>
          </Link>
        ))
      ) : (
        Array(6).fill().map((_, index) => (
          <div key={index} className="h-[120px] w-full bg-gray-300 animate-pulse rounded-lg"></div>
        ))
      )}
    </div>
  );
}

export default CategoryList;