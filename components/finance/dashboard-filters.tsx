"use client";

import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useFilter } from "@/contexts/filter-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function DashboardFilters() {
    const { startDate, endDate, setRange, setCurrentPeriod } = useFilter();

    const clearFilters = () => {
        setRange(undefined, undefined);
        setCurrentPeriod("custom");
    };

    return (
        <Card className="mb-10 bg-white border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                                <CalendarIcon className="h-3.5 w-3.5 text-emerald-600" /> Data Inicial
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full bg-slate-50 border-slate-200 rounded-xl h-11 pl-4 pr-10 justify-start text-left font-normal transition-all hover:bg-slate-100/50",
                                            !startDate && "text-slate-400"
                                        )}
                                    >
                                        {startDate ? (
                                            format(startDate, "dd/MM/yyyy", { locale: ptBR })
                                        ) : (
                                            <span>dd/mm/aaaa</span>
                                        )}
                                        <CalendarIcon className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-xl border-slate-200 shadow-xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => {
                                            setRange(date, endDate);
                                            setCurrentPeriod("custom");
                                        }}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                                <CalendarIcon className="h-3.5 w-3.5 text-emerald-600" /> Data Final
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full bg-slate-50 border-slate-200 rounded-xl h-11 pl-4 pr-10 justify-start text-left font-normal transition-all hover:bg-slate-100/50",
                                            !endDate && "text-slate-400"
                                        )}
                                    >
                                        {endDate ? (
                                            format(endDate, "dd/MM/yyyy", { locale: ptBR })
                                        ) : (
                                            <span>dd/mm/aaaa</span>
                                        )}
                                        <CalendarIcon className="absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-xl border-slate-200 shadow-xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => {
                                            setRange(startDate, date);
                                            setCurrentPeriod("custom");
                                        }}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="flex-1 md:flex-none gap-2 border-slate-200 h-11 px-6 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl"
                        >
                            <X className="h-4 w-4" />
                            Limpar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
