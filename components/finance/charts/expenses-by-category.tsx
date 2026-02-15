"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    XAxis,
    YAxis,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";

const COLORS = [
    "#ef4444", // Red
    "#f97316", // Orange
    "#facc15", // Yellow
    "#4ade80", // Green
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
];

const chartConfig = {
    amount: {
        label: "Valor",
        color: "#10b981",
    },
} satisfies ChartConfig;

interface ExpensesByCategoryProps {
    data: {
        category: string;
        amount: number;
    }[];
}

export function ExpensesByCategory({ data }: ExpensesByCategoryProps) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <CardTitle className="text-base font-medium">
                    Gastos por Categoria
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            left: 40,
                            right: 12,
                        }}
                    >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            width={100}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
