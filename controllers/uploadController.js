const uploadService = require('../services/uploadService.js');

const uploadHouseImages = async (req, res) => {
  try {
    const files = req.files;

    const images = await uploadService.uploadHouseImages(files);

    return res.status(200).json({
      success: true,
      message: 'House images uploaded successfully',
      data: images,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;

    const avatar = await uploadService.uploadAvatar(file);

    return res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: avatar,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const uploadEscrowProof = async (req, res) => {
  try {
    const file = req.file;

    const proof = await uploadService.uploadEscrowProof(file);

    return res.status(200).json({
      success: true,
      message: 'Escrow proof uploaded successfully',
      data: proof,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const uploadChatMedia = async (req, res) => {
  try {
    const file = req.file;

    const media = await uploadService.uploadChatMedia(file);

    return res.status(200).json({
      success: true,
      message: 'Chat media uploaded successfully',
      data: media,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  uploadHouseImages,
  uploadAvatar,
  uploadEscrowProof,
  uploadChatMedia,
}