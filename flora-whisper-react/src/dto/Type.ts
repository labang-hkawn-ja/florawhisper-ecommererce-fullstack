import type { PlantDto } from "./PlantDto";

export interface CartItem {
  plant: PlantDto;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (plant: PlantDto, quantity?: number) => void;
  removeFromCart: (plantId: number) => void;
  updateQuantity: (plantId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalCost: () => number;
  getTotalItems: () => number;
  getPlantQuantities: () => Map<number, number>;
}