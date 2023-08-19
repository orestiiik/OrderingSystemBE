export interface Item {
    id: string;
    data: ItemData;
}

export interface NewItem {
    id: string;
    data: NewItemData;
}

export interface ItemData {
    name: string;
    category: Category;
    price: number;
    weight: number;
    liquid: boolean;
    state: string;
}

export interface NewItemData {
    name: string;
    category: string;
    price: number;
    weight: number;
    liquid: boolean;
    state: string;
    ingredients: [string]
}

export interface Category {
    id: string;
    data: CategoryData;
}

export interface CategoryData {
    name: string;
    active: boolean;
}
