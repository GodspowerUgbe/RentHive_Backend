const express = require('express');
const authMiddleware = require('../middlewares/auth')
const {
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
} = require('../controllers/housesController');

const Router = express.Router();


Router.post('/',postHouse)
.get('/',getHouses)
.get('/:houseId',getHouse)
.patch('/:houseId',editHouseData)
.delete('/:houseId',deleteHouse)
.get('/search',searchHouses)
.get('/nearby',getNearbyHouses)
.get('/owner/me',getMyHouses)
.post('/:houseId/reactions',addReaction)
.delete('/:houseId/reactions/:reactionId',removeReaction)
.get('/:houseId/reactions', getHouseReactions)
.get('/:houseId/comments', getHouseComments)
.post('/:houseId/comments', addComment)
.delete('/comments/:commentId', deleteComment);

module.exports = Router;