"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Transaction } from "@/types/transaction";

export interface TransactionWithDetails extends Transaction {
    categories: {
        name: string;
    };
    payment_method: {
        name: string;
    };
}

export function useTransactions(startDate?: Date, endDate?: Date) {
    const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            let query = supabase
                .from("transactions")
                .select(`
                    *,
                    categories (name),
                    payment_method (name)
                `);

            if (startDate) {
                query = query.gte("date", startDate.toISOString());
            }

            if (endDate) {
                query = query.lte("date", endDate.toISOString());
            }

            const { data, error: supabaseError } = await query.order("date", { ascending: false });

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            setTransactions(data as any || []);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching transactions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    return { transactions, isLoading, error, refetch: fetchTransactions };
}
