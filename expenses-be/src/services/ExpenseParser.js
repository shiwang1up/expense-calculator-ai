const Groq = require('groq-sdk');

class ExpenseParser {
    constructor() {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    async parse(input) {
        if (!input) return null;

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an API that parses natural language expense text into structured JSON.
                        Output ONLY valid JSON. Do not include markdown formatting or explanations.
                        
                        Schema:
                        {
                            "amount": Number,
                            "currency": String (default "INR"),
                            "category": String (e.g., "Food & Dining", "Transport", "Entertainment", "Groceries", "Utilities", "Health", "Shopping", "General"),
                            "description": String (brief description),
                            "merchant": String (extract merchant name efficiently, default "Unknown")
                        }
                        
                        Example Input: "spent 500 on lunch at subway"
                        Example Output: {"amount": 500, "currency": "INR", "category": "Food & Dining", "description": "Lunch", "merchant": "Subway"}
                        
                        Example Input: "uber 350 to office"
                        Example Output: {"amount": 350, "currency": "INR", "category": "Transport", "description": "Ride to office", "merchant": "Uber"}`
                    },
                    {
                        role: "user",
                        content: input
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
            });

            console.log("Raw AI Response:", JSON.stringify(completion, null, 2));

            const content = completion.choices[0]?.message?.content;
            if (!content) return null;

            // Clean up code blocks if present
            const jsonStr = content.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();

            const data = JSON.parse(jsonStr);
            data.original_input = input;

            // Validate and normalize essential fields
            const parsedAmount = Number(data.amount);
            if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
                console.warn("ExpenseParser: Invalid or missing amount in parsed data", {
                    input,
                    rawAmount: data.amount,
                });
                return null;
            }
            data.amount = parsedAmount;

            if (typeof data.description !== "string" || !data.description.trim()) {
                console.warn("ExpenseParser: Missing or empty description in parsed data", {
                    input,
                    description: data.description,
                });
                // Instead of failing, try to use input as description if short enough, or just generic
                // But for now, let's strictly require it or return null as per plan, 
                // OR we can default it to "Expense" if missing. 
                // Plan said: "Validate description is a non-empty string." and "Return null if validation fails".
                return null;
            }
            data.description = data.description.trim();

            if (typeof data.currency === "string" && data.currency.trim()) {
                data.currency = data.currency.trim().toUpperCase();
            } else {
                data.currency = "INR";
            }

            if (typeof data.category === "string" && data.category.trim()) {
                data.category = data.category.trim();
            } else {
                data.category = "General";
            }

            // Refine Merchant if Unknown
            if (!data.merchant || data.merchant.toLowerCase() === 'unknown') {
                console.log("Merchant is Unknown. Attempting to infer from description...");
                try {
                    const merchantCompletion = await this.groq.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: `You are an expert at identifying merchant names from payment descriptions.
                                Input: "${data.description}" (Original: "${input}")
                                Task: Identify the most likely merchant name.
                                Output: Return ONLY the merchant name as a JSON string. If absolutely unknown, return "Unknown".
                                Example Output: "Uber" or "Starbucks" or "Dr. Smith's Clinic"`
                            },
                            {
                                role: "user",
                                content: `Extract merchant from: ${data.description}`
                            }
                        ],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.1,
                    });

                    const merchantContent = merchantCompletion.choices[0]?.message?.content;
                    if (merchantContent) {
                        // Clean up quotes and whitespace
                        const inferredMerchant = merchantContent.replace(/^"|"$/g, '').trim();
                        if (inferredMerchant.toLowerCase() !== 'unknown') {
                            data.merchant = inferredMerchant;
                            console.log("Inferred Merchant:", data.merchant);
                        }
                    }
                } catch (retryError) {
                    console.error("Merchant Inference Error:", retryError.message);
                }
            }

            return data;

        } catch (error) {
            console.error("ExpenseParser Error:", error.message);
            // Fallback to simple regex parsing if AI fails (optional, but good for robustness)
            // For now, return null to indicate failure
            return null;
        }
    }
}

module.exports = ExpenseParser;
