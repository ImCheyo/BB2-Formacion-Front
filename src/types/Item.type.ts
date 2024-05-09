import { Reduction } from "./Reduction.type";
import { Supplier } from "./Supplier.type";
import { User } from "./User.type";

export interface Item{
    itemCode: number;
    description: string;
    price: number;
    itemStateEnum: string;
    suppliersDTO: Supplier[];
    reductionsDTO: Reduction[];
    userDTO: User;
    create_At: string;
}