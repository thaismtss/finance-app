"use client";

import { useState } from "react";
import {
    DollarSign,
    TrendingDown,
    BarChart3,
    Loader2,
} from "lucide-react";
import { SummaryCard } from "@/components/finance/summary-card";
import { DashboardHeader } from "@/components/finance/dashboard-header";
import { useSummary } from "@/hooks/use-summary";

import { useFilter } from "@/contexts/filter-context";
import { useDashboardCharts } from "@/hooks/use-dashboard-charts";
import { MonthlyDemonstrative } from "@/components/finance/charts/monthly-demonstrative";
import { ProfitEvolution } from "@/components/finance/charts/profit-evolution";
import { CashFlow } from "@/components/finance/charts/cash-flow";
import { ExpensesByCategory } from "@/components/finance/charts/expenses-by-category";
import { RevenuesByType } from "@/components/finance/charts/revenues-by-type";

export default function DashboardPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { startDate, endDate } = useFilter();
    const { summary, isLoading: isSummaryLoading } = useSummary(startDate, endDate);
    const {
        monthlyData,
        cashFlowData,
        expensesByCategoryData,
        revenuesByTypeData,
        isLoading: isChartsLoading
    } = useDashboardCharts(startDate, endDate);

    const isLoading = isSummaryLoading || isChartsLoading;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/50">
                <main className="mx-auto max-w-7xl py-10">
                    <DashboardHeader isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen} />
                    <div className="flex h-[200px] w-full items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            <p className="text-sm font-medium text-slate-500">Carregando painel...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <DashboardHeader isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <SummaryCard
                    title="Receitas"
                    amount={formatCurrency(summary.totalIncome)}
                    icon={DollarSign}
                    variant="success"
                    trend={{ value: "+0%", label: "vs mês anterior", isPositive: true }}
                />
                <SummaryCard
                    title="Gastos"
                    amount={formatCurrency(summary.totalExpenses)}
                    icon={TrendingDown}
                    variant="danger"
                    trend={{ value: "-0%", label: "vs mês anterior", isPositive: false }}
                />
                <SummaryCard
                    title="Lucro / Prejuízo"
                    amount={formatCurrency(summary.balance)}
                    icon={BarChart3}
                    variant="info"
                    trend={{ value: "0%", label: "margem", isPositive: true }}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div className="lg:col-span-2">
                    <MonthlyDemonstrative data={monthlyData} />
                </div>
                <div className="lg:col-span-2">
                    <ProfitEvolution data={monthlyData.map((d: { month: string; lucro: number }) => ({ month: d.month, lucro: d.lucro }))} />
                </div>
                <div className="lg:col-span-4">
                    <CashFlow data={cashFlowData} />
                </div>
                <div className="lg:col-span-2">
                    <ExpensesByCategory data={expensesByCategoryData} />
                </div>
                <div className="lg:col-span-2">
                    <RevenuesByType data={revenuesByTypeData} />
                </div>
            </div>
        </div>
    );
}
