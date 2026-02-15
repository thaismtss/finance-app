"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function DeleteTransactionDialog({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}: DeleteTransactionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-slate-200">
                <DialogHeader className="flex flex-col items-center gap-4 pt-4">
                    <div className="rounded-full bg-rose-50 p-4">
                        <AlertTriangle className="h-8 w-8 text-rose-500" />
                    </div>
                    <div className="space-y-1 text-center">
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            Confirmar exclusão
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="flex gap-2 sm:gap-0 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 h-11 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-100"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Excluir"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
