import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  source: 'dummyjson' | 'fakestore';
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { itemCount, total };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color &&
        item.source === action.payload.source
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
    
    removeFromCart: (state, action: PayloadAction<{ id: number; size?: string; color?: string; source: string }>) => {
      state.items = state.items.filter(
        item => !(item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color &&
        item.source === action.payload.source)
      );
      
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number; size?: string; color?: string; source: string }>) => {
      const item = state.items.find(
        item => item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.color === action.payload.color &&
        item.source === action.payload.source
      );
      
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.id === action.payload.id && 
            i.size === action.payload.size && 
            i.color === action.payload.color &&
            i.source === action.payload.source)
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      
      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
