const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rent:{
        type:String,
    },
    price:{
        type:String
    },
    address: { type: String, required: true }, 
    geometry: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true,
            index: '2dsphere',
        }
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    media:{

    },
    status:{
        required:true,
        enum:['available','rented'],
        type:String
    }
},{
    timestamps:true
});

const House = mongoose.model('House',houseSchema);

module.exports = House;