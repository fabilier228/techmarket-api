const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');

const getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.getById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password_hash, firstName, lastName } = req.body;
    console.log(req.body)

    try {
        const updatedUser = await User.update(id, { username, email, password_hash, firstName, lastName });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.delete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: `Deleted user: ${id}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
