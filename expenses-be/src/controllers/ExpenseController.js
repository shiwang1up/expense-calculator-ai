class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }

    addExpense = (req, res) => {
        try {
            const { input } = req.body;
            if (!input) {
                return res.status(400).json({ success: false, error: "Input is required" });
            }

            const expense = this.expenseService.createExpense(input);
            res.status(201).json({
                success: true,
                expense
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    getExpenses = (req, res) => {
        const expenses = this.expenseService.getAllExpenses();
        res.status(200).json({
            success: true,
            expenses
        });
    }

    deleteExpense = (req, res) => {
        const id = parseInt(req.params.id);
        const success = this.expenseService.deleteExpense(id);

        if (!success) {
            return res.status(404).json({
                success: false,
                error: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    }
}

module.exports = ExpenseController;
