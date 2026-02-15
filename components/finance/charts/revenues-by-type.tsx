"use client";

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
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
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#f43f5e", // Rose
    "#8b5cf6", // Purple
];

const chartConfig = {
    value: {
        label: "Valor",
    },
} satisfies ChartConfig;

interface RevenuesByTypeProps {
    data: {
        name: string;
        value: number;
        percentage: number;
    }[];
}

export function RevenuesByType({ data }: RevenuesByTypeProps) {
    return (
        <Card className="col-span-1 lg:col-span-1">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <PieChartIcon className="h-4 w-4 text-orange-500" />
                <CardTitle className="text-base font-medium">
                    Receitas por Tipo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
