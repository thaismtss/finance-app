import { TransactionType } from "./transaction";

export interface Category {
    id: number;
    name: string;
    parent_id: number | null;
    type: TransactionType;
}
