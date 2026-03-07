const House = require('../models/House');
const createError= require('../utils/createError');

const postHouse = async (ownerId, houseData) => {
  const newHouse = await House.create({
    ...houseData,
    owner: ownerId,
  });

  return newHouse;
}

const getHouses = async (filters = {}, limit = 20, skip = 0) => {
  const query = {};

  if (filters.location) query.location = filters.location;
  if (filters.bedrooms) query.bedrooms = { $gte: filters.bedrooms };
  if (filters.maxBudget) query.rent = { $lte: filters.maxBudget };

  const houses = await House.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('owner', 'name email avatar');

  return houses;
};

const getHouse = async (id)=>{
    const house = await House.findById(id);
    if(!house){
        throw createError('House not found',404);
    }
    return house;
}

const editHouseData = async (houseId, ownerId, updateData) => {
  const house = await House.findById(houseId);

  if (!house) throw createError('House not found', 404);
  if (house.owner.toString() !== ownerId)
    throw createError('Unauthorized', 403);

  Object.assign(house, updateData);
  await house.save();

  return house;
};


const deleteHouse = async (id)=>{
    try{        
        const house = await House.findByIdAndDelete(id);
        return house;
    }catch(err){
        console.error(err);
        throw createError('Error encounter while deleting house', 500);
    }

}



const searchHouses = async (queryText, filters = {}, limit = 20) => {
  const query = {
    $text: { $search: queryText }, // requires text index on title + description
  };

  if (filters.location) query.location = filters.location;
  if (filters.bedrooms) query.bedrooms = { $gte: filters.bedrooms };
  if (filters.maxBudget) query.rent = { $lte: filters.maxBudget };

  const houses = await House.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .limit(limit)
    .populate('owner', 'name email avatar');

  return houses;
};

const getNearbyHouses = async ({
  longitude,
  latitude,
  maxDistance = 5000, // meters
  limit = 20,
}) => {
  return await House.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  })
    .limit(limit)
    .populate('owner', 'name avatar');
};

const getMyHouses = async (id)=>{
    const myHouses = await Houses.find({
        owner:id
    });
    return myHouses;
}

const addReaction = async ({ houseId, userId, type }) => {
  // prevent duplicate reactions
  const existing = await Reaction.findOne({ house: houseId, user: userId });
  if (existing) {
    existing.type = type;
    return await existing.save();
  }

  return await Reaction.create({
    house: houseId,
    user: userId,
    type,
  });
};


const removeReaction = async ({ houseId, userId }) => {
  await Reaction.findOneAndDelete({
    house: houseId,
    user: userId,
  });

  return { success: true };
};


const getHouseReactions = async (houseId) => {
  const reactions = await Reaction.aggregate([
    { $match: { house: houseId } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  return reactions;
};


const getHouseComments = async (houseId) => {
  return await Comment.find({ house: houseId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
};


const addComment = async ({ houseId, userId, text }) => {
  return await Comment.create({
    house: houseId,
    user: userId,
    text,
  });
};


const deleteComment = async ({ commentId, userId }) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw createError('Comment not found',404);

  if (comment.user.toString() !== userId)
    throw createError('Unauthorized',403);

  await comment.deleteOne();
  return { success: true };
};


module.exports = {
    postHouse,
    getHouses,
    getHouse,
    editHouseData,
    deleteHouse,
    searchHouses,
    getNearbyHouses,
    getMyHouses,
    addReaction,
    removeReaction,
    getHouseReactions,
    getHouseComments,
    addComment,
    deleteComment
}