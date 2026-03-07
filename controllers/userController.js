const userService = require('../services/userService');
const createError = require('../utils/createError');
const User = require('../models/User.js');


const getMe = async (req,res)=>{
  const user = req.user;
  const result = await userService.getMe(user);
  res.status(200).json(result);
}

const updateMe = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = req.user;
    const updatedUser = await userService.updateMe(user, { name, bio });
    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};


const updateAvatar = (req,res)=>{

}

const getUserById = async (req,res)=>{
  const { userId } = req.params;
  const result = await userService.getUserById(userId);
  res.status(200).json(result);
}

const updateUserRole = (req,res)=>{

}

const blockUser = async (req,res)=>{
  const {userId} = req.params;
  const currUser = req.user;
  const result = await userService.blockUser(userId, currUser);
  res.status(201).json({
    success: true,
    message: 'User blocked successfully'
  });

}

module.exports =  {
  getMe,
  updateMe,
  updateAvatar,
  getUserById,
  updateUserRole,
  blockUser,
}
