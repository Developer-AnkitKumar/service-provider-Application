const BASE_URL = "http://localhost:5000";

const getCategory = async () => {
    try {
        const response = await fetch(`${BASE_URL}/category`);
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        // console.log(data)
        return data || []; // Ensure correct response
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []; // Return empty array on error
    }
};

const getAllBusinessList = async () => {
    try {
        const response = await fetch(`${BASE_URL}/business`);
        if (!response.ok) throw new Error("Failed to fetch business list");

        const data = await response.json();
        return data || []; // Handle potential null response
    } catch (error) {
        console.error("Error fetching business list:", error);
        return []; // Return empty array on error
    }
};

// 🆕 Get Business by ID
const getBusinessById = async (businessId) => {
    try {
        const response = await fetch(`${BASE_URL}/business/${businessId}`);
        if (!response.ok) throw new Error("Failed to fetch business details");

        const data = await response.json();
        return data || null; // Ensure valid response
    } catch (error) {
        console.error(`Error fetching business with ID ${businessId}:`, error);
        return null; // Return null if error occurs
    }
};

export default { getCategory, getAllBusinessList, getBusinessById };