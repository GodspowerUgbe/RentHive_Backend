// Import your Mongoose models
const User = require('../models/User');
const House = require('../models/House');
const Escrow = require('../models/Escrow');
const Report = require('../models/Report');

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find().populate('owner', 'name email'); 
    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching houses', error: error.message });
  }
};

const getAllEscrows = async (req, res) => {
  try {
    const escrows = await Escrow.find();
    res.status(200).json(escrows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching escrow records', error: error.message });
  }
};


const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllHouses,
  getAllEscrows,
  getReports
};
