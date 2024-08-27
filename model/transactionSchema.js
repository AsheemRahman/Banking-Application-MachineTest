
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw'],
    },
    orderId:{
        type: Number
    },
    amount: {
        type: Number,
        default : 0
    },
},{timestamps: true});

module.exports = mongoose.model('Transaction',TransactionSchema)
