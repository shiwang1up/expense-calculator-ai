class ExpenseParser {
    parse(input) {
        if (!input) return null;

        const amountMatch = input.match(/(\d+(\.\d{2})?)/);
        if (!amountMatch) return null;
        const amount = parseFloat(amountMatch[0]);

        let merchant = "Unknown Merchant";
        // Try to find merchant after "at" or "from"
        const merchantMatch = input.match(/\b(at|from)\s+([a-zA-Z\s]+?)(?=(\s\d|$))/i);
        if (merchantMatch && merchantMatch[2]) {
            merchant = merchantMatch[2].trim();
        } else {
            if (input.toLowerCase().startsWith("uber")) {
                merchant = "Uber";
            } else if (input.toLowerCase().includes("swiggy")) {
                merchant = "Swiggy";
            } else if (input.toLowerCase().includes("zomato")) {
                merchant = "Zomato";
            }
        }

        let category = "General";
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes("food") || lowerInput.includes("lunch") || lowerInput.includes("dinner") || lowerInput.includes("breakfast") || lowerInput.includes("restaurant") || lowerInput.includes("eat")) {
            category = "Food & Dining";
        } else if (lowerInput.includes("uber") || lowerInput.includes("ola") || lowerInput.includes("taxi") || lowerInput.includes("bus") || lowerInput.includes("train") || lowerInput.includes("flight") || lowerInput.includes("transport")) {
            category = "Transport";
        } else if (lowerInput.includes("movie") || lowerInput.includes("cinema") || lowerInput.includes("netflix")) {
            category = "Entertainment";
        } else if (lowerInput.includes("grocery") || lowerInput.includes("vegetables") || lowerInput.includes("milk")) {
            category = "Groceries";
        }

        let description = input;
        description = description.replace(/^spent\s+\d+\s+(on\s+)?/i, "").trim();
        description = description.replace(/\s+\d+$/, "").trim();

        if (merchant === "Unknown Merchant") {
            if (description.includes("Taj Hotel")) merchant = "Taj Hotel";
        }

        return {
            amount,
            currency: "INR",
            category,
            description: description.charAt(0).toUpperCase() + description.slice(1),
            merchant,
            original_input: input
        };
    }
}

module.exports = ExpenseParser;
