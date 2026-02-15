export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
    id?: number;
    created_at?: string;
    value: number;
    description: string;
    category_id: number;
    payment_id: number;
    date: string;
    type: TransactionType;
}

export interface InsertTransaction extends Omit<Transaction, "id" | "created_at"> { }
