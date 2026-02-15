"use client";

import { useState } from "react";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment";

export function PaymentMethodSettings() {
    const { paymentMethods, isLoading, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePaymentMethods();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenDialog = (paymentMethod?: PaymentMethod) => {
        if (paymentMethod) {
            setEditingPaymentMethod(paymentMethod);
            setName(paymentMethod.name);
        } else {
            setEditingPaymentMethod(null);
            setName("");
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            if (editingPaymentMethod) {
                await updatePaymentMethod(editingPaymentMethod.id, name);
                toast.success("Forma de pagamento atualizada com sucesso!");
            } else {
                await addPaymentMethod(name);
                toast.success("Forma de pagamento adicionada com sucesso!");
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Erro ao salvar forma de pagamento.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta forma de pagamento?")) return;

        try {
            await deletePaymentMethod(id);
            toast.success("Forma de pagamento excluída com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir forma de pagamento.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Formas de Pagamento</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} size="sm" className="bg-[#008573] hover:bg-[#007061]">
                            <Plus className="mr-2 h-4 w-4" /> Nova Forma de Pagamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingPaymentMethod ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}</DialogTitle>
                                <DialogDescription>
                                    As formas de pagamento facilitam o registro de suas transações.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Dinheiro, Cartão de Crédito, PIX..."
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-[#008573] hover:bg-[#007061]">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Salvar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentMethods.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                    Nenhuma forma de pagamento encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paymentMethods.map((pm) => (
                                <TableRow key={pm.id}>
                                    <TableCell className="font-medium">{pm.name}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(pm)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(pm.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
