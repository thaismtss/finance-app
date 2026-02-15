"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { InsertTransaction } from "@/types/transaction";

export function useInsertTransaction() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const insertTransaction = async (transaction: InsertTransaction) => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            const { data, error: supabaseError } = await supabase
                .from("transactions")
                .insert([transaction])
                .select();

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            return data;
        } catch (err: any) {
            setError(err.message || "An error occurred while inserting the transaction");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { insertTransaction, isLoading, error };
}
