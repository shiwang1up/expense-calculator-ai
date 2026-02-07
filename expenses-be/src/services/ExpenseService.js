class ExpenseService {
    constructor(expenseRepository, expenseParser) {
        this.expenseRepository = expenseRepository;
        this.expenseParser = expenseParser;
    }

    createExpense(input) {
        const parsedData = this.expenseParser.parse(input);
        if (!parsedData) {
            throw new Error("Could not parse expense. Please include an amount.");
        }
        return this.expenseRepository.add(parsedData);
    }

    getAllExpenses() {
        return this.expenseRepository.findAll();
    }

    deleteExpense(id) {
        return this.expenseRepository.deleteById(id);
    }
}

module.exports = ExpenseService;
