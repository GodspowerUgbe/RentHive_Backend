const createError= require('../utils/createError');
const houseService = require('../services/houseService.js');

const postHouse = (req,res)=>{


}

const getHouses = (req,res)=>{
    
}

const getHouse = async (req,res)=>{
    const {id} = req.body;
    const house = await houseService.getHouse(id);
    res.status(200).json(house);
}

const editHouseData = (req,res)=>{

}


const deleteHouse = async (req,res)=>{
    const {id} = req.body;
    try{        
        const house = await houseService.deleteHouse(id);
        res.status(201).json(house);
    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:'Error encounter while deleting house'
        });

    }
    
}

const searchHouses = (req,res)=>{

}

const getNearbyHouses = (req,res)=>{

}

const getMyHouses = async (req,res)=>{
    const id = req.user.id;
    const myHouses = await houseService.getMyHouses(id);
    res.status(200).json(myHouses);
}

const addReaction = (req,res)=>{

}

const removeReaction = (req,res)=>{

}

const getHouseReactions = (req,res)=>{

}

const getHouseComments = (req,res)=>{

}

const addComment = (req,res)=>{

}

const deleteComment = (req,res)=>{


}

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