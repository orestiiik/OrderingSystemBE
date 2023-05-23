
export interface Item {
    id: string;
    data: ItemData;
}

export interface ItemData {
    name: string;
    category: Category;
    price: number;
    weight: number;
    liquid: boolean;
    state: string;
}

export interface Category {
    id: string;
    data: CategoryData;
}

export interface CategoryData {
    name: string;
    active: boolean;
}
