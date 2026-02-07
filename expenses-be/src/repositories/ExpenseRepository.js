const Expense = require('../models/Expense');

class ExpenseRepository {
    async add(expenseData) {
        const expense = new Expense(expenseData);
        return await expense.save();
    }

    async findAll() {
        return await Expense.find().sort({ created_at: -1 });
    }

    async deleteById(id) {
        return await Expense.findByIdAndDelete(id);
    }
}

module.exports = ExpenseRepository;
