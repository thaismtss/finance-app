"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { useInsertTransaction } from "@/hooks/use-insert-transaction";
import { useUpdateTransaction } from "@/hooks/use-update-transaction";
import { useCategories } from "@/hooks/use-categories";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { Transaction, TransactionType } from "@/types/transaction";
import { Loader2 } from "lucide-react";

interface TransactionFormProps {
    onClose: () => void;
    initialData?: Transaction;
    onTransactionAdded?: () => void;
}

export function TransactionForm({ onClose, initialData, onTransactionAdded }: TransactionFormProps) {
    const isEditing = !!initialData;
    const [type, setType] = useState<"income" | "expense">(
        initialData?.type === "INCOME" ? "income" : "expense"
    );
    const [date, setDate] = useState<Date | undefined>(
        initialData?.date ? parseISO(initialData.date) : new Date()
    );
    const [amount, setAmount] = useState(initialData?.value.toString().replace(".", ",") || "");
    const [categoryId, setCategoryId] = useState(initialData?.category_id.toString() || "");
    const [paymentId, setPaymentId] = useState(initialData?.payment_id.toString() || "");
    const [description, setDescription] = useState(initialData?.description || "");

    const { insertTransaction, isLoading: isInserting, error: insertError } = useInsertTransaction();
    const { updateTransaction, isLoading: isUpdating, error: updateError } = useUpdateTransaction();
    const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();
    const { paymentMethods, isLoading: isLoadingPaymentMethods, error: paymentMethodsError } = usePaymentMethods();

    const isLoading = isInserting || isUpdating;
    const error = insertError || updateError;

    const filteredCategories = categories.filter(
        (cat) => cat.type === (type === "income" ? "INCOME" : "EXPENSE")
    );

    const handleSubmit = async () => {
        if (!amount || !date || !categoryId || !paymentId) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const transactionData = {
            value: parseFloat(amount.replace(",", ".")),
            description,
            category_id: parseInt(categoryId),
            payment_id: parseInt(paymentId),
            date: format(date, "yyyy-MM-dd"),
            type: (type === "income" ? "INCOME" : "EXPENSE") as TransactionType,
        };

        const result = isEditing
            ? await updateTransaction(initialData!.id!, transactionData)
            : await insertTransaction(transactionData);

        if (result) {
            onTransactionAdded?.();
            onClose();
        }
    };

    return (
        <div className="flex flex-col gap-6 py-4">
            {/* Type Selector */}
            {/* ... (keep as is) */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => {
                        setType("income");
                        setCategoryId("");
                    }}
                    className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-4 transition-all",
                        type === "income"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                    )}
                >
                    <TrendingUp className={cn("h-5 w-5", type === "income" ? "text-emerald-500" : "text-slate-400")} />
                    <span>Entrada</span>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setType("expense");
                        setCategoryId("");
                    }}
                    className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-4 transition-all",
                        type === "expense"
                            ? "border-rose-500 bg-rose-50 text-rose-700 font-medium"
                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                    )}
                >
                    <TrendingDown className={cn("h-5 w-5", type === "expense" ? "text-rose-500" : "text-slate-400")} />
                    <span>Saída</span>
                </button>
            </div>

            {/* Value Field */}
            <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-700 font-semibold">Valor (R$)</Label>
                <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500 transition-all font-medium text-slate-600"
                />
            </div>

            {/* Date Field */}
            <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Data</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "h-12 w-full justify-start text-left font-normal rounded-xl border-slate-200 px-4",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                            {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-slate-100" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            locale={ptBR}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-700 font-semibold">Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoadingCategories}>
                    <SelectTrigger id="category" className="h-12 rounded-xl border-slate-200 text-slate-600">
                        {isLoadingCategories ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Carregando...</span>
                            </div>
                        ) : (
                            <SelectValue placeholder="Selecione a categoria" />
                        )}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl border-slate-100">
                        {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {categoriesError && (
                    <p className="text-rose-500 text-xs mt-1">{categoriesError}</p>
                )}
            </div>

            {/* Payment Method Field */}
            <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-slate-700 font-semibold">Forma de Pagamento</Label>
                <Select value={paymentId} onValueChange={setPaymentId} disabled={isLoadingPaymentMethods}>
                    <SelectTrigger id="paymentMethod" className="h-12 rounded-xl border-slate-200 text-slate-600">
                        {isLoadingPaymentMethods ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Carregando...</span>
                            </div>
                        ) : (
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                        )}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl border-slate-100">
                        {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id.toString()}>
                                {method.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {paymentMethodsError && (
                    <p className="text-rose-500 text-xs mt-1">{paymentMethodsError}</p>
                )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-semibold">Descrição</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o lançamento..."
                    className="min-h-[100px] rounded-xl border-slate-200 focus:ring-emerald-500 transition-all resize-none"
                />
            </div>

            {error && (
                <div className="text-rose-500 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl bg-[#008573] hover:bg-[#007061] text-white font-bold shadow-lg shadow-emerald-100"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        isEditing ? "Salvar" : "Adicionar"
                    )}
                </Button>
            </div>
        </div>
    );
}
