export interface Expense {
  id: string;
  title: string; // The original input text or short summary
  amount: number;
  date: Date;
  category: string; // Emoji + Name e.g. "🍔 Food & Dining"
  description?: string; // Parsed description
  merchant?: string; // Parsed merchant
}

export interface ExpenseGroup {
  date: string;
  data: Expense[];
}

export const CATEGORIES = {
  FOOD: "🍔 Food & Dining",
  TRANSPORT: "🚗 Transport",
  SHOPPING: "🛒 Shopping",
  ENTERTAINMENT: "📺 Entertainment",
  BILLS: "📄 Bills & Utilities",
  HEALTH: "💊 Health",
  TRAVEL: "✈️ Travel",
  OTHER: "📦 Other",
};

// Dummy Data
let MOCK_EXPENSES: Expense[] = [
  {
    id: "1",
    title: "Lunch with client",
    amount: 850,
    date: new Date(),
    category: CATEGORIES.FOOD,
    description: "Lunch meeting",
    merchant: "Taj",
  },
  {
    id: "2",
    title: "Uber to office",
    amount: 450,
    date: new Date(),
    category: CATEGORIES.TRANSPORT,
    description: "Commute",
    merchant: "Uber",
  },
];

export const ExpenseService = {
  getExpensesGroupedByDate: (): ExpenseGroup[] => {
    const groups: Record<string, Expense[]> = {};

    // Sort by date desc
    const sorted = [...MOCK_EXPENSES].sort(
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
  },

  addExpense: async (text: string): Promise<Expense> => {
    console.log("Adding expense from text:", text);
    // Simulate AI Parsing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock parsing logic based on keywords
    const lower = text.toLowerCase();
    let amount = 0;
    const amountMatch = text.match(/(\d+)/);
    if (amountMatch) amount = parseInt(amountMatch[0], 10);

    let category = CATEGORIES.OTHER;
    if (
      lower.includes("food") ||
      lower.includes("lunch") ||
      lower.includes("dinner")
    )
      category = CATEGORIES.FOOD;
    else if (
      lower.includes("uber") ||
      lower.includes("taxi") ||
      lower.includes("bus")
    )
      category = CATEGORIES.TRANSPORT;
    else if (lower.includes("grocery") || lower.includes("buy"))
      category = CATEGORIES.SHOPPING;
    else if (lower.includes("movie") || lower.includes("netflix"))
      category = CATEGORIES.ENTERTAINMENT;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      title: text,
      amount: amount || 100, // Fallback if no specific amount found
      date: new Date(),
      category,
      description: "Parsed from natural language",
      merchant: "Unknown Merchant", // In real app, AI extracts this
    };

    MOCK_EXPENSES = [newExpense, ...MOCK_EXPENSES];
    return newExpense;
  },

  deleteExpense: async (id: string) => {
    console.log("Deleting expense:", id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    MOCK_EXPENSES = MOCK_EXPENSES.filter((e) => e.id !== id);
  },
};
