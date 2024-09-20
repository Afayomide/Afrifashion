const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    clothes: [
        {
            fabricId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Clothes', // Reference to the Fabric model
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentReference: {
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    paymentGateway: {
        type: String,
        default: 'Paystack'
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    callbackUrl: {
        type: String
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
