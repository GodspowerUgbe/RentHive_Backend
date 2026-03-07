const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const createError = require('../utils/createError');

const getMe = async (user) => {
    if (!user) {
        throw createError('User not found', 404);
    }
    const { name, email, password, tel, verified, profilePic, role } = user;
    return { name, email, password, tel, verified, profilePic, role };
}

const updateMe = async (user, { name, bio }) => {
    if (name) user.name = name;
    if (bio) user.bio = bio;
    const updatedUser = await user.save();
    return updatedUser;
}


const updateAvatar = async (userId, avatarData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Delete old avatar if exists
  if (user.avatar && user.avatar.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId);
  }

  user.avatar = avatarData;

  await user.save();

  return user.avatar;
};


const getUserById = async (id) => {
  console.log('id:', id);
    const user = await User.findById(id);
    if (!user) {
        throw createError('User not found', 404);
    }
    const { name, email, password, tel, verified, profilePic, role } = user;
    return { name, email, password, tel, verified, profilePic, role };
}

const updateUserRole = async (userId, newRole) => {
  const allowedRoles = ['renter', 'owner', 'admin'];

  if (!allowedRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.role = newRole;

  await user.save();

  return {
    id: user._id,
    role: user.role,
  };
};




module.exports = {
    getMe,
    updateMe,
    getUserById,
    updateAvatar,
    updateUserRole,
}
