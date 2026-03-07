

const uploadHouseImages = async (files) => {
  if (!files || files.length === 0) {
    throw new Error('No house images provided');
  }

  return files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));
};

const uploadAvatar = async (file) => {
  if (!file) {
    throw new Error('No avatar file provided');
  }

  return {
    url: file.path,
    publicId: file.filename,
  };
};


const uploadEscrowProof = async (file) => {
  if (!file) {
    throw new Error('Escrow proof required');
  }

  return {
    url: file.path,
    publicId: file.filename,
    uploadedAt: new Date(),
  };
};


const uploadChatMedia = async (file) => {
  if (!file) {
    throw new Error('Chat media required');
  }

  return {
    url: file.path,
    publicId: file.filename,
    resourceType: file.mimetype,
  };
};


module.exports = {
  uploadHouseImages,
  uploadAvatar,
  uploadEscrowProof,
  uploadChatMedia,
}