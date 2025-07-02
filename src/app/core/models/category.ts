export interface Category {
    id: string;
    value: string;
    label: string;
    icon?: string; // Optional icon for the category
    color?: string; // Optional color for the category
    selected?: boolean; // Optional property to indicate if the category is selected
}