const express = require('express');

function createExpenseRoutes(expenseController) {
    const router = express.Router();

    router.post('/', expenseController.addExpense);
    router.get('/', expenseController.getExpenses);
    router.delete('/:id', expenseController.deleteExpense);

    return router;
}

module.exports = createExpenseRoutes;
