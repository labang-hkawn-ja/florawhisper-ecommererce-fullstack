import { createContext } from 'react';
import type { CartContextType } from './Type';

export const CartContext = createContext<CartContextType | null>(null);