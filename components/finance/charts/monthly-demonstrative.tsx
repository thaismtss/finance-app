"use client";

import {
    Area,
    AreaChart,
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
import { LineChart as LineChartIcon } from "lucide-react";

const chartConfig = {
    receitas: {
        label: "Receitas",
        color: "#10b981",
    },
    gastos: {
        label: "Gastos",
        color: "#f43f5e",
    },
} satisfies ChartConfig;

interface MonthlyDemonstrativeProps {
    data: {
        month: string;
        receitas: number;
        gastos: number;
    }[];
}

export function MonthlyDemonstrative({ data }: MonthlyDemonstrativeProps) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <LineChartIcon className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-base font-medium">
                    Demonstrativo Mensal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <AreaChart
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
                            tickFormatter={(value) => value}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="gastos"
                            type="monotone"
                            fill="#f43f5e"
                            fillOpacity={0.4}
                            stroke="#f43f5e"
                            stackId="a"
                        />
                        <Area
                            dataKey="receitas"
                            type="monotone"
                            fill="#10b981"
                            fillOpacity={0.4}
                            stroke="#10b981"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
