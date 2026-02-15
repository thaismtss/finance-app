"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
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
import { TrendingUp } from "lucide-react";

const chartConfig = {
    lucro: {
        label: "Lucro",
        color: "#3b82f6",
    },
} satisfies ChartConfig;

interface ProfitEvolutionProps {
    data: {
        month: string;
        lucro: number;
    }[];
}

export function ProfitEvolution({ data }: ProfitEvolutionProps) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <CardTitle className="text-base font-medium">
                    Evolução do Lucro
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <LineChart
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
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Line
                            dataKey="lucro"
                            type="monotone"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{
                                fill: "#3b82f6",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
