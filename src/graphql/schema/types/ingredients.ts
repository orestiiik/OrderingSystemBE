export interface Ingredient {
    id: string;
    name: string;
    canBeExtra: boolean;
    extraPrice: number;
}

export interface NewIngredient {
    name: string;
    canBeExtra: boolean;
    extraPrice: number;
}