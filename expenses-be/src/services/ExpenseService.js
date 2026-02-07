class ExpenseService {
    constructor(expenseRepository, expenseParser) {
        this.expenseRepository = expenseRepository;
        this.expenseParser = expenseParser;
    }

    async createExpense(input) {
        const parsedData = await this.expenseParser.parse(input);
        if (!parsedData) {
            throw new Error("Could not parse expense. Please provide clear details like amount and merchant.");
        }
        return await this.expenseRepository.add(parsedData);
    }

    async getAllExpenses() {
        return await this.expenseRepository.findAll();
    }

    async deleteExpense(id) {
        return await this.expenseRepository.deleteById(id);
    }
}

module.exports = ExpenseService;
