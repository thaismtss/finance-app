import { Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TransactionForm } from "./transaction-form";
import { useFilter } from "@/contexts/filter-context";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";

interface DashboardHeaderProps {
    isSheetOpen: boolean;
    setIsSheetOpen: (open: boolean) => void;
    onTransactionAdded?: () => void;
    title?: string;
    description?: string;
}

export function DashboardHeader({
    isSheetOpen,
    setIsSheetOpen,
    onTransactionAdded,
    title = "Dashboard Financeiro",
    description = "Visão geral do desempenho financeiro"
}: DashboardHeaderProps) {
    const { currentPeriod, setCurrentPeriod, setRange } = useFilter();

    const monthOptions = useMemo(() => {
        if (typeof window === "undefined") return [];

        const now = new Date();
        const options = [];
        for (let i = 0; i < 12; i++) {
            const date = subMonths(now, i);
            const value = format(date, "yyyy-MM");
            const label = format(date, "MMMM yyyy", { locale: ptBR });
            options.push({ value, label, date });
        }
        return options;
    }, []);

    const handlePeriodChange = (value: string) => {
        setCurrentPeriod(value);
        if (value === "last-3") {
            setRange(startOfMonth(subMonths(new Date(), 2)), endOfMonth(new Date()));
        } else if (value === "current-year") {
            const now = new Date();
            setRange(new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear(), 11, 31));
        } else if (value === "last-year") {
            const lastYear = new Date().getFullYear() - 1;
            setRange(new Date(lastYear, 0, 1), new Date(lastYear, 11, 31));
        } else {
            const selectedDate = monthOptions.find(opt => opt.value === value)?.date || new Date();
            setRange(startOfMonth(selectedDate), endOfMonth(selectedDate));
        }
    };

    return (
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
                <h2 className="text-3xl font-bold text-[#1e293b]">{title}</h2>
                <p className="text-slate-500 font-medium">{description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Select value={currentPeriod} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-[200px] h-11 rounded-xl border-slate-200 bg-white text-slate-600 font-medium shadow-sm">
                        <CalendarDays className="mr-2 h-4 w-4 text-emerald-600" />
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="current-year">Ano Atual</SelectItem>
                        <SelectItem value="last-year">Ano Anterior</SelectItem>
                        <SelectItem value="last-3">Últimos 3 meses</SelectItem>
                        {monthOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="capitalize">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-[#008573] hover:bg-[#007061] text-white gap-2 h-11 px-6 shadow-md shadow-emerald-50 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Plus className="h-5 w-5" />
                            Novo Lançamento
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[450px] overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="text-2xl font-bold text-[#1e293b]">Novo Lançamento</SheetTitle>
                        </SheetHeader>
                        <TransactionForm
                            onClose={() => setIsSheetOpen(false)}
                            onTransactionAdded={onTransactionAdded}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
