"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSummary(startDate?: Date, endDate?: Date) {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            let query = supabase
                .from("transactions")
                .select("value, type");

            if (startDate) {
                query = query.gte("date", startDate.toISOString());
            }

            if (endDate) {
                query = query.lte("date", endDate.toISOString());
            }

            const { data, error: supabaseError } = await query;

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            const totals = (data || []).reduce(
                (acc, transaction) => {
                    if (transaction.type === "INCOME") {
                        acc.totalIncome += transaction.value;
                    } else if (transaction.type === "EXPENSE") {
                        acc.totalExpenses += transaction.value;
                    }
                    return acc;
                },
                { totalIncome: 0, totalExpenses: 0 }
            );

            setSummary({
                totalIncome: totals.totalIncome,
                totalExpenses: totals.totalExpenses,
                balance: totals.totalIncome - totals.totalExpenses,
            });
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching summary data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [startDate, endDate]);

    return { summary, isLoading, error, refetch: fetchSummary };
}
