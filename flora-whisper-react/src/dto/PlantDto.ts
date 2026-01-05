
export type PlantDto = {
    plantId?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    updatePrice: number;
    
    plantSize?: string;
    isEasyToCare?: boolean;
    careInstructions?: string;
    
    color?: string;
    piece?: number;

    category?: string;
}