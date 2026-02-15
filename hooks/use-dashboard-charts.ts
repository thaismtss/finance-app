"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, startOfYear, endOfYear, eachMonthOfInterval, isWithinInterval, parseISO, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export function useDashboardCharts(startDate?: Date, endDate?: Date) {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = async () => {
        setIsLoading(true);
        const supabase = createClient();

        try {
            // Fetch transactions for the selected year (or current year)
            const baseDate = startDate || new Date();
            const yearStart = startOfYear(baseDate);
            const yearEnd = endOfYear(baseDate);

            // We want to cover both the selected range AND the full year for the demonstrative charts
            const queryStart = startDate && startDate < yearStart ? startDate : yearStart;
            const queryEnd = endDate && endDate > yearEnd ? endDate : yearEnd;

            const { data, error: supabaseError } = await supabase
                .from("transactions")
                .select(`
                    id,
                    value,
                    type,
                    date,
                    category_id,
                    categories (
                        id,
                        name
                    )
                `)
                .gte("date", queryStart.toISOString())
                .lte("date", queryEnd.toISOString());

            if (supabaseError) throw new Error(supabaseError.message);

            setTransactions(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    // Format data for Monthly Demonstrative & Profit Evolution
    const monthlyData = useMemo(() => {
        // We need a stable base date for prerendering to avoid hydration mismatches
        // and build errors. If startDate is not provided, we only use "now" on the client.
        const baseDate = startDate || (typeof window !== "undefined" ? new Date() : new Date(2025, 0, 1));

        // If we're on the server and no startDate is provided, we can return empty to be safe
        // or use the fixed year. Let's return empty if no transactions and no startDate to avoid mismatch.
        if (typeof window === "undefined" && !startDate) return [];

        const months = eachMonthOfInterval({
            start: startOfYear(baseDate),
            end: endOfYear(baseDate),
        });

        return months.map((month) => {
            const monthTransactions = transactions.filter((t) => {
                const date = parseISO(t.date);
                return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
            });

            const income = monthTransactions
                .filter((t) => t.type === "INCOME")
                .reduce((sum, t) => sum + t.value, 0);
            const expenses = monthTransactions
                .filter((t) => t.type === "EXPENSE")
                .reduce((sum, t) => sum + t.value, 0);

            return {
                month: format(month, "MMM", { locale: ptBR }),
                receitas: income,
                gastos: expenses,
                lucro: income - expenses,
            };
        });
    }, [transactions, startDate]);

    // Format data for Cash Flow (Monthly from Jan to Dec)
    const cashFlowData = useMemo(() => {
        const baseDate = startDate || (typeof window !== "undefined" ? new Date() : new Date(2025, 0, 1));

        if (typeof window === "undefined" && !startDate) return [];

        const months = eachMonthOfInterval({
            start: startOfYear(baseDate),
            end: endOfYear(baseDate),
        });

        return months.map((month) => {
            const monthTransactions = transactions.filter((t) => {
                const date = parseISO(t.date);
                return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
            });

            const income = monthTransactions
                .filter((t) => t.type === "INCOME")
                .reduce((sum, t) => sum + t.value, 0);
            const expenses = monthTransactions
                .filter((t) => t.type === "EXPENSE")
                .reduce((sum, t) => sum + t.value, 0);

            return {
                month: format(month, "MMM", { locale: ptBR }),
                entradas: income,
                saidas: expenses,
            };
        });
    }, [transactions, startDate]);

    // Format Data for Expenses by Category
    const expensesByCategoryData = useMemo(() => {
        if (!startDate || !endDate) return [];

        const categoryMap = new Map();

        transactions.forEach((t) => {
            const date = parseISO(t.date);
            if (t.type === "EXPENSE" && isWithinInterval(date, { start: startDate, end: endDate })) {
                const categoryName = t.categories?.name || "Outros";
                categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + t.value);
            }
        });

        return Array.from(categoryMap.entries())
            .map(([name, value]) => ({ category: name, amount: value }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions, startDate, endDate]);

    // Format Data for Revenues by Type
    const revenuesByTypeData = useMemo(() => {
        if (!startDate || !endDate) return [];

        const categoryMap = new Map();
        let total = 0;

        transactions.forEach((t) => {
            const date = parseISO(t.date);
            if (t.type === "INCOME" && isWithinInterval(date, { start: startDate, end: endDate })) {
                const categoryName = t.categories?.name || "Outros";
                categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + t.value);
                total += t.value;
            }
        });

        return Array.from(categoryMap.entries())
            .map(([name, value]) => ({
                name,
                value,
                percentage: total > 0 ? (value / total) * 100 : 0
            }))
            .sort((a, b) => b.value - a.value);
    }, [transactions, startDate, endDate]);

    return {
        isLoading,
        error,
        monthlyData,
        cashFlowData,
        expensesByCategoryData,
        revenuesByTypeData,
        refetch: fetchTransactions
    };
}
