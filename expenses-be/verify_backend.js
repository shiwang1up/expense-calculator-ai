const BASE_URL = 'http://localhost:3000/api/expenses';

// NOTE: This script requires Node.js v18+ for built-in fetch support.
async function runTests() {
    console.log('Starting Backend Verification...');

    let expenseId = null;

    // 1. Add Expense
    console.log('\n--- 1. Testing Add Expense ---');
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: 'Spent 500 on dinner at Subway' })
        });
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Add Expense Success:', data);
            if (data.expense && data.expense._id) {
                expenseId = data.expense._id;
            }
        } else {
            console.error('❌ Add Expense Failed:', data);
            console.log('👉 Note: This is expected if GROQ_API_KEY is not set or invalid.');
        }
    } catch (error) {
        console.error('❌ Add Expense Network Error:', error.message);
    }

    // 2. Get Expenses
    console.log('\n--- 2. Testing Get Expenses ---');
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Get Expenses Success. Count:', data.expenses.length);
            // Limit output
            console.log('First 2 expenses:', data.expenses.slice(0, 2));

            if (!expenseId && data.expenses.length > 0) {
                expenseId = data.expenses[0]._id;
            }
        } else {
            console.error('❌ Get Expenses Failed:', data);
        }
    } catch (error) {
        console.error('❌ Get Expenses Network Error:', error.message);
    }

    // 3. Delete Expense
    if (expenseId) {
        console.log(`\n--- 3. Testing Delete Expense (ID: ${expenseId}) ---`);
        try {
            const response = await fetch(`${BASE_URL}/${expenseId}`, {
                method: 'DELETE'
            });
            const data = await response.json(); // API may return 204 No Content, but our controller returns 200 JSON

            if (response.ok) {
                console.log('✅ Delete Expense Success:', data);
            } else {
                console.error('❌ Delete Expense Failed:', data);
            }
        } catch (error) {
            console.error('❌ Delete Expense Network Error:', error.message);
        }
    } else {
        console.log('\n⚠️ Skipping Delete Test (No ID available)');
    }
}

runTests();
