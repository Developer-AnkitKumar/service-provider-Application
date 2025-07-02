const express=require('express');
const Category=require("../models/Category");

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    // console.log(categories)
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
});

// @desc    Create a new category
// @route   POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, icon } = req.body;
    const category = new Category({ name, icon });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(400).json({ message: "Error creating category", error: err.message });
  }
});

// @desc    Update category by ID
// @route   PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Category updated", category: updatedCategory });
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err.message });
  }
});

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err.message });
  }
});

module.exports=router
