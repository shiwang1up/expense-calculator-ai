class ExpenseRepository {
    constructor() {
        this.expenses = [];
        this.nextId = 1;
    }

    add(expense) {
        const newExpense = {
            id: this.nextId++,
            ...expense,
            created_at: new Date().toISOString()
        };
        this.expenses.push(newExpense);
        return newExpense;
    }

    findAll() {
        return [...this.expenses].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    deleteById(id) {
        const index = this.expenses.findIndex(e => e.id === id);
        if (index === -1) {
            return false;
        }
        this.expenses.splice(index, 1);
        return true;
    }
}

module.exports = ExpenseRepository;
