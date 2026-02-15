import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, TrendingUp, TrendingDown, ClipboardX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions, TransactionWithDetails } from "@/hooks/use-transactions";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useState } from "react";
import { Transaction } from "@/types/transaction";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { TransactionForm } from "./transaction-form";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import { useDeleteTransaction } from "@/hooks/use-delete-transaction";
import { toast } from "sonner";

interface TransactionTableProps {
    transactions: TransactionWithDetails[];
    isLoading: boolean;
    refetch: () => void;
}

export function TransactionTable({ transactions, isLoading, refetch }: TransactionTableProps) {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deletingTransactionId, setDeletingTransactionId] = useState<number | null>(null);

    const { deleteTransaction, isLoading: isDeleting } = useDeleteTransaction();

    const handleDelete = async () => {
        if (!deletingTransactionId) return;

        const result = await deleteTransaction(deletingTransactionId);

        if (result) {
            toast.success("Lançamento excluído com sucesso!");
            setDeletingTransactionId(null);
            refetch();
        } else {
            toast.error("Erro ao excluir lançamento.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    <p className="text-sm font-medium text-slate-500">Carregando lançamentos...</p>
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="rounded-full bg-slate-50 p-4">
                        <ClipboardX className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-900">Nenhum lançamento encontrado</h3>
                        <p className="max-w-[300px] text-sm text-slate-500">
                            Parece que você ainda não tem transações registradas. Adicione uma para começar!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-200">
                        <TableHead className="w-[120px] font-bold text-slate-700 h-14">Data</TableHead>
                        <TableHead className="w-[140px] font-bold text-slate-700 h-14">Tipo</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Categoria</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Descrição</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Forma de Pagamento</TableHead>
                        <TableHead className="text-right font-bold text-slate-700 h-14">Valor</TableHead>
                        <TableHead className="text-center font-bold text-slate-700 h-14">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <TableCell className="text-slate-600 font-medium py-4">
                                {format(parseISO(transaction.date), "dd/MM/yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="py-4">
                                {transaction.type === "INCOME" ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none px-3 py-1 gap-1 font-semibold">
                                        <TrendingUp className="h-3 w-3" />
                                        Receita
                                    </Badge>
                                ) : (
                                    <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-none px-3 py-1 gap-1 font-semibold">
                                        <TrendingDown className="h-3 w-3" />
                                        Gasto
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-slate-600 font-medium py-4">
                                {transaction.categories?.name}
                            </TableCell>
                            <TableCell className="text-slate-500 py-4">{transaction.description}</TableCell>
                            <TableCell className="text-slate-600 font-medium py-4">
                                {transaction.payment_method?.name}
                            </TableCell>
                            <TableCell className={cn(
                                "text-right font-bold py-4 tabular-nums",
                                transaction.type === "INCOME" ? "text-emerald-600" : "text-rose-500"
                            )}>
                                {transaction.type === "INCOME" ? "+ " : "- "}
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(transaction.value)}
                            </TableCell>
                            <TableCell className="text-center py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingTransaction(transaction)}
                                        className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeletingTransactionId(transaction.id!)}
                                        className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Edit Sheet */}
            <Sheet
                open={!!editingTransaction}
                onOpenChange={(open) => !open && setEditingTransaction(null)}
            >
                <SheetContent className="sm:max-w-[450px] overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-bold text-[#1e293b]">
                            Editar Lançamento
                        </SheetTitle>
                    </SheetHeader>
                    {editingTransaction && (
                        <TransactionForm
                            initialData={editingTransaction}
                            onClose={() => setEditingTransaction(null)}
                            onTransactionAdded={refetch}
                        />
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <DeleteTransactionDialog
                isOpen={!!deletingTransactionId}
                onClose={() => setDeletingTransactionId(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
