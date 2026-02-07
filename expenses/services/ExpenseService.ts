export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency?: string; // Currency code e.g. "USD", "INR"
  date: Date;
  category: string; // Plain name e.g. "Food & Dining"
  emoji: string; // Emoji e.g. "🍔"
  description?: string;
  merchant?: string;
}

export interface ExpenseGroup {
  date: string;
  data: Expense[];
}

export const CATEGORY_CONFIG: Record<string, { name: string; emoji: string }> =
  {
    FOOD: { name: "Food & Dining", emoji: "🍔" },
    TRANSPORT: { name: "Transport", emoji: "🚗" },
    SHOPPING: { name: "Shopping", emoji: "🛒" },
    ENTERTAINMENT: { name: "Entertainment", emoji: "📺" },
    BILLS: { name: "Bills & Utilities", emoji: "📄" },
    HEALTH: { name: "Health", emoji: "💊" },
    TRAVEL: { name: "Travel", emoji: "✈️" },
    OTHER: { name: "Other", emoji: "📦" },
  };

// Use special IP for Android Emulator loopback to localhost
const API_URL = "http://10.0.2.2:3000/api/expenses";

const getCategoryConfig = (backendCategory: string) => {
  const normalized = backendCategory.toUpperCase();
  const mapping: Record<string, keyof typeof CATEGORY_CONFIG> = {
    "FOOD & DINING": "FOOD",
    TRANSPORT: "TRANSPORT",
    SHOPPING: "SHOPPING",
    ENTERTAINMENT: "ENTERTAINMENT",
    "BILLS & UTILITIES": "BILLS",
    HEALTH: "HEALTH",
    TRAVEL: "TRAVEL",
    OTHER: "OTHER",
  };

  const key = mapping[normalized] || "OTHER";
  return CATEGORY_CONFIG[key];
};

export const ExpenseService = {
  getExpensesGroupedByDate: async (): Promise<ExpenseGroup[]> => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to fetch expenses");
      }

      const expenses: Expense[] = json.expenses.map((e: any) => {
        const config = getCategoryConfig(e.category);
        return {
          id: e._id,
          title: e.description || e.original_input,
          amount: e.amount,
          currency: e.currency,
          date: new Date(e.created_at),
          category: config.name,
          emoji: config.emoji,
          description: e.description,
          merchant: e.merchant,
        };
      });

      // Group by date
      const groups: Record<string, Expense[]> = {};

      // Sort by date desc
      const sorted = expenses.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );

      sorted.forEach((expense) => {
        const dateOption = { day: "numeric", month: "short" } as const;
        const dateKey = expense.date.toLocaleDateString("en-GB", dateOption);

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(expense);
      });

      return Object.keys(groups).map((date) => ({
        date: `date - ${date}`,
        data: groups[date],
      }));
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  },

  addExpense: async (text: string): Promise<Expense | null> => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: text }),
      });

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to add expense");
      }

      const e = json.expense;
      const config = getCategoryConfig(e.category);
      return {
        id: e._id,
        title: e.description || e.original_input,
        amount: e.amount,
        currency: e.currency,
        date: new Date(e.created_at),
        category: config.name,
        emoji: config.emoji,
        description: e.description,
        merchant: e.merchant,
      };
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  deleteExpense: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },
};
