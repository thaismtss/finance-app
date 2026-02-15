"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { PaymentMethod } from "@/types/payment";

export function usePaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentMethods = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            const { data, error: supabaseError } = await supabase
                .from("payment_method")
                .select("*")
                .order("name", { ascending: true });

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            setPaymentMethods(data || []);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching payment methods");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const addPaymentMethod = async (name: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("payment_method")
            .insert([{ name }])
            .select();

        if (error) throw error;
        await fetchPaymentMethods();
        return data?.[0];
    };

    const updatePaymentMethod = async (id: number, name: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("payment_method")
            .update({ name })
            .eq("id", id)
            .select();

        if (error) throw error;
        await fetchPaymentMethods();
        return data?.[0];
    };

    const deletePaymentMethod = async (id: number) => {
        const supabase = createClient();
        const { error } = await supabase
            .from("payment_method")
            .delete()
            .eq("id", id);

        if (error) throw error;
        await fetchPaymentMethods();
    };

    return {
        paymentMethods,
        isLoading,
        error,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        refresh: fetchPaymentMethods
    };
}
