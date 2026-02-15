"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useDeleteTransaction() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTransaction = async (id: number) => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            const { error: supabaseError } = await supabase
                .from("transactions")
                .delete()
                .eq("id", id);

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            return true;
        } catch (err: any) {
            setError(err.message || "An error occurred while deleting the transaction");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteTransaction, isLoading, error };
}
