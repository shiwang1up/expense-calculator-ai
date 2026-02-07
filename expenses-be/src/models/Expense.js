const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    category: {
        type: String,
        default: 'General'
    },
    description: {
        type: String,
        required: false
    },
    merchant: {
        type: String,
        default: 'Unknown'
    },
    original_input: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
