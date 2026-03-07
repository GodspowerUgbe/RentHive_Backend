const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema({
    house: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'House'
    },
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'funded', 'released', 'disputed', 'refunded'],
        default: 'pending'
    },
    paystackRef: String,
    refundRef: String,
    refundedAt: Date,
    refundedBy: {
        type: String,
        default: 'system',
    }
}, {
    timestamps: true
});

const Escrow = mongoose.model('Escrow', escrowSchema);

module.exports = Escrow;