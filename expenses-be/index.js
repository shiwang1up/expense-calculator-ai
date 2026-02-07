const express = require('express');
const ExpenseRepository = require('./src/repositories/ExpenseRepository');
const ExpenseParser = require('./src/services/ExpenseParser');
const ExpenseService = require('./src/services/ExpenseService');
const ExpenseController = require('./src/controllers/ExpenseController');
const createExpenseRoutes = require('./src/routes/expenseRoutes');

const app = express();
const port = 3000;

app.use(express.json());

// Dependency Injection
const expenseRepository = new ExpenseRepository();
const expenseParser = new ExpenseParser();
const expenseService = new ExpenseService(expenseRepository, expenseParser);
const expenseController = new ExpenseController(expenseService);

// Routes
app.use('/api/expenses', createExpenseRoutes(expenseController));

app.listen(port, () => {
    console.log(`Expense API listening at http://localhost:${port}`);
});
