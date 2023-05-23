import {Category} from './categories'

export interface Sale {
    id: string;
    data: SaleData;
}

export interface SaleData {
    done?: boolean;
    address?: Address;
    person?: Person;
    price: number;
    order: ItemType[];
}

export interface Address {
    city?: string;
    street?: string;
    note?: string;
}

export interface Person {
    fullName?: string;
    telephone?: string;
}

export interface ItemType {
    category?: Category;
    items: ItemDataType[];
}

export interface ItemDataType {
    name?: string;
    price: number;
    weight?: number;
    liquid?: boolean;
    state?: string;
    quantity: number;
}

export interface LastSale {
    date: string;
    totalPrice: number;
}

export interface Query {
    getSales: Sale[];
    getSaleById(id: string): Sale | null;
    getTodaySalesTotal: number;
    getTodayPriceTotal: number;
    getTotalSoldQuantity: number;
    getLastSales: LastSale[];
}

export interface ItemTypeInput {
    category?: CategoryInputType;
    items: ItemDataTypeInput[];
}

export interface ItemDataTypeInput {
    name?: string;
    price: number;
    weight?: number;
    liquid?: boolean;
    state?: string;
    quantity: number;
}

export interface CategoryInputType {
    id?: string;
    data?: CategoryDataType;
}

export interface CategoryDataType {
    name?: string;
    active?: boolean;
}

export interface SaleInput {
    done?: boolean;
    address?: AddressInput;
    person?: PersonInput;
    items: ItemTypeInput[];
}

export interface AddressInput {
    city?: string;
    street?: string;
    note?: string;
}

export interface PersonInput {
    fullName?: string;
    telephone?: string;
}

export interface Mutation {
    createSale(newSale: SaleInput): Sale | null;
    deleteSale(id: string): boolean;
}
