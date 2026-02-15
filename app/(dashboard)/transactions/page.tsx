"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/finance/dashboard-header";
import { TransactionTable } from "@/components/finance/transaction-table";
import { useTransactions } from "@/hooks/use-transactions";
import { useFilter } from "@/contexts/filter-context";

export default function TransactionsPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { startDate, endDate } = useFilter();
    const { transactions, isLoading, refetch } = useTransactions(startDate, endDate);

    return (
        <div className="space-y-10">
            <DashboardHeader
                isSheetOpen={isSheetOpen}
                setIsSheetOpen={setIsSheetOpen}
                title="Lançamentos"
                description="Gerencie receitas e despesas"
                onTransactionAdded={refetch}
            />

            <div className="space-y-6">
                <TransactionTable
                    transactions={transactions}
                    isLoading={isLoading}
                    refetch={refetch}
                />
            </div>
        </div>
    );
}
