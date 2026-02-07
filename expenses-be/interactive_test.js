require('dotenv').config();
const readline = require('readline');
const mongoose = require('mongoose');
const connectDB = require('./src/db/database');
const ExpenseParser = require('./src/services/ExpenseParser');
const ExpenseRepository = require('./src/repositories/ExpenseRepository');

// Emoji map for categories
const CATEGORY_EMOJIS = {
    'Food & Dining': '🍔',
    'Transport': '🚕',
    'Entertainment': '🎬',
    'Groceries': '🛒',
    'Utilities': '💡',
    'Health': '💊',
    'Shopping': '🛍️',
    'General': '📝'
};

function formatOutput(expense) {
    const emoji = CATEGORY_EMOJIS[expense.category] || '📝';
    return `
Amount: ₹${expense.amount}
Category: ${emoji} ${expense.category}
Description: ${expense.description}
Merchant: ${expense.merchant}
`;
}

async function runInteractivetest() {
    // Connect to DB
    await connectDB();

    const parser = new ExpenseParser();
    const repository = new ExpenseRepository();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = () => {
        rl.question('\ninput ->\n', async (input) => {
            if (input.toLowerCase() === 'exit') {
                console.log('Exiting...');
                await mongoose.disconnect();
                rl.close();
                process.exit(0);
            }

            try {
                console.log('\nProcessing...');

                // 1. Parse
                const parsedData = await parser.parse(input);
                if (!parsedData) {
                    console.log('❌ Could not parse input.');
                    askQuestion();
                    return;
                }

                console.log('Payload:', JSON.stringify(parsedData, null, 2));

                // 2. Save
                const savedExpense = await repository.add(parsedData);
                console.log('✅ Saved to MongoDB');

                // 3. Formatted Output
                console.log(formatOutput(savedExpense));

            } catch (error) {
                console.error('Error:', error.message);
            }

            askQuestion();
        });
    };

    console.log('--- Interactive Expense Tester ---');
    console.log('Type a natural language expense description (or "exit" to quit).');
    askQuestion();
}

runInteractivetest();
