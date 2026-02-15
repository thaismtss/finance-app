"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
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
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { Calendar } from "lucide-react";

const chartConfig = {
    entradas: {
        label: "Entradas",
        color: "#10b981",
    },
    saidas: {
        label: "Saídas",
        color: "#ef4444",
    },
} satisfies ChartConfig;

interface CashFlowProps {
    data: {
        month: string;
        entradas: number;
        saidas: number;
    }[];
}

export function CashFlow({ data }: CashFlowProps) {
    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <Calendar className="h-4 w-4 text-teal-500" />
                <CardTitle className="text-base font-medium">
                    Fluxo de Caixa
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="entradas" fill="#10b981" radius={4} />
                        <Bar dataKey="saidas" fill="#ef4444" radius={4} />
                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
