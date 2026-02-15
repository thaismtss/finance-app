import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
    title: string;
    amount: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        label: string;
        isPositive?: boolean;
    };
    variant?: "success" | "danger" | "info";
    className?: string;
}

export function SummaryCard({
    title,
    amount,
    icon: Icon,
    trend,
    variant = "info",
    className,
}: SummaryCardProps) {
    const variants = {
        success: "bg-[#10b981] shadow-emerald-100",
        danger: "bg-[#ef4444] shadow-red-100",
        info: "bg-[#3b82f6] shadow-blue-100",
    };

    return (
        <Card className={cn(
            "text-white border-none shadow-xl rounded-3xl overflow-hidden p-1",
            variants[variant],
            className
        )}>
            <CardContent className="p-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">{title}</p>
                        <h3 className="text-4xl font-black tabular-nums tracking-tight">{amount}</h3>
                    </div>
                    <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Icon className="h-7 w-7" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/90 bg-white/10 w-fit px-3 py-1 rounded-full">
                        {trend.isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{trend.value} {trend.label}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
