const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    house:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'House',
        required:true
    },
    type:{
        ref:'String',
        enum:['like','save','dislike']
    }
},{
    timestamps:true
});

const Reaction = mongoose.model('Reaction',reactionSchema);

module.exports = Reaction;