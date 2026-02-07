class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }

    addExpense = async (req, res) => {
        try {
            const { input } = req.body;
            if (!input) {
                return res.status(400).json({ success: false, error: "Input is required" });
            }

            const expense = await this.expenseService.createExpense(input);
            res.status(201).json({
                success: true,
                expense
            });
        } catch (error) {
            console.error("Add Expense Error:", error);
            res.status(500).json({
                success: false,
                error: error.message || "Internal Server Error"
            });
        }
    }

    getExpenses = async (req, res) => {
        try {
            const expenses = await this.expenseService.getAllExpenses();
            res.status(200).json({
                success: true,
                expenses
            });
        } catch (error) {
            console.error("Get Expenses Error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to fetch expenses"
            });
        }
    }

    deleteExpense = async (req, res) => {
        try {
            const id = req.params.id; // ID is likely a string (MongoDB ObjectID)
            const success = await this.expenseService.deleteExpense(id);

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
        } catch (error) {
            console.error("Delete Expense Error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to delete expense"
            });
        }
    }
}

module.exports = ExpenseController;
