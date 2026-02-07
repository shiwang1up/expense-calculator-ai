require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db/database');
const ExpenseRepository = require('./src/repositories/ExpenseRepository');
const ExpenseParser = require('./src/services/ExpenseParser');
const ExpenseService = require('./src/services/ExpenseService');
const ExpenseController = require('./src/controllers/ExpenseController');
const createExpenseRoutes = require('./src/routes/expenseRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection
const expenseRepository = new ExpenseRepository();
const expenseParser = new ExpenseParser();
const expenseService = new ExpenseService(expenseRepository, expenseParser);
const expenseController = new ExpenseController(expenseService);

// Routes
app.use('/api/expenses', createExpenseRoutes(expenseController));

// Health check
app.get('/', (req, res) => {
    res.send('Expense Calculator API is running');
});

app.listen(port, () => {
    console.log(`Expense API listening at http://localhost:${port}`);
});

module.exports = app;
