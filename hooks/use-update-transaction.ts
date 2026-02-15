"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InsertTransaction } from "@/types/transaction";

export function useUpdateTransaction() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTransaction = async (id: number, transaction: InsertTransaction) => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            const { data, error: supabaseError } = await supabase
                .from("transactions")
                .update(transaction)
                .eq("id", id)
                .select();

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            return data;
        } catch (err: any) {
            setError(err.message || "An error occurred while updating the transaction");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateTransaction, isLoading, error };
}
