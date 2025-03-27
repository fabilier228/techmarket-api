const { v4: uuidv4 } = require('uuid');
const Category = require('../models/categoryModel');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.getById(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = await Category.create(name, description);
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedCategory = await Category.update(id, { name, description });

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    console.log("costam")

    try {
        const deletedCategory = await Category.delete(id);
        console.log("costam",deletedCategory)
        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: `Deleted category: ${id}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
};
