const { Router } = require('express');
const {
  uploadHouseImages,
  uploadAvatar,
  uploadEscrowProof,
  uploadChatMedia,
} = require('../controllers/uploadController.js');

const router = Router();

router.post('/houses', uploadHouseImages);
router.post('/avatar', uploadAvatar);
router.post('/escrow', uploadEscrowProof);
router.post('/chat', uploadChatMedia);
module.exports =  router;
