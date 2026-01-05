import React, {
  useState,
  type ReactNode,
} from "react";
import type { PlantDto } from "../dto/PlantDto";
import type { CartContextType, CartItem } from "../dto/Type";
import { CartContext } from "../dto/CartContext";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (plant: PlantDto, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.plant.plantId === plant.plantId
      );

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.plant.plantId === plant.plantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { plant, quantity }];
      }
    });
  };

  const removeFromCart = (plantId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.plant.plantId !== plantId)
    );
  };

  const updateQuantity = (plantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(plantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.plant.plantId === plantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalCost = () => {
    return cartItems.reduce(
      (total, item) => total + item.plant.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getPlantQuantities = (): Map<number, number> => {
    const quantities = new Map<number, number>();
    cartItems.forEach((item) => {
      quantities.set(item.plant.plantId!, item.quantity);
    });
    return quantities;
  };

  const cartContextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalCost,
    getTotalItems,
    getPlantQuantities,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

