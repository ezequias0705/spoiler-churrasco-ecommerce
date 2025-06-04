import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(item => 
            item.productId === newItem.productId && 
            JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
          );
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              )
            };
          }
          
          return {
            items: [...state.items, { ...newItem, id: Date.now() }]
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const customizationCost = item.customizations?.additionalCost || 0;
          return total + (item.price + customizationCost) * item.quantity;
        }, 0);
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = subtotal > 200 ? 0 : 15; // Free shipping over R$ 200
        return subtotal + shipping;
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'spoiler-cart',
    }
  )
);
