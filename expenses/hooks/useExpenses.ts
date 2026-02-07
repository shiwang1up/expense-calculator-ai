import { ExpenseGroup, ExpenseService } from "../services/ExpenseService";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<ExpenseGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ExpenseService.getExpensesGroupedByDate();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch expenses");
      Alert.alert("Error", "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
  };
};
