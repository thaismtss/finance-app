"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/category";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            const { data, error: supabaseError } = await supabase
                .from("categories")
                .select("*")
                .order("name", { ascending: true });

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            setCategories(data || []);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching categories");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = async (category: Omit<Category, "id">) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("categories")
            .insert([category])
            .select();

        if (error) throw error;
        await fetchCategories();
        return data?.[0];
    };

    const updateCategory = async (id: number, category: Partial<Omit<Category, "id">>) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("categories")
            .update(category)
            .eq("id", id)
            .select();

        if (error) throw error;
        await fetchCategories();
        return data?.[0];
    };

    const deleteCategory = async (id: number) => {
        const supabase = createClient();
        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);

        if (error) throw error;
        await fetchCategories();
    };

    return {
        categories,
        isLoading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        refresh: fetchCategories
    };
}
