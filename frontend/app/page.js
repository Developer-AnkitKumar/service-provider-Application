// app/page.js or wherever your Home component is
"use client";

import { useEffect, useState } from "react";
import Hero from "./_components/Hero";
import CategoryList from "./_components/CategoryList";
import BusinessList from "./_components/BusinessList";
import GlobalApi from "./_services/GlobalApi";

export default function Home() {
  const [categoryList, setCategoryList] = useState([]);
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);
  const [businessList, setBusinessList] = useState([]);

  useEffect(() => {
    fetchCategoryList();
    fetchBusinessList();
  }, []);

  const fetchCategoryList = async () => {
    const data = await GlobalApi.getCategory();
    setCategoryList(data);
    setFilteredCategoryList(data); // Default view
  };

  const fetchBusinessList = async () => {
    const data = await GlobalApi.getAllBusinessList();
    setBusinessList(data);
  };

  const handleSearchCategory = (searchText) => {
    const filtered = categoryList.filter((cat) =>
      cat.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCategoryList(filtered);
  };

  return (
    <div>
      <Hero onSearch={handleSearchCategory} />
      <CategoryList categoryList={filteredCategoryList} />
      <BusinessList businessList={businessList} title={"Popular Business"} />
    </div>
  );
}
