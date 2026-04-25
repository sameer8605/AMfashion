import { createSlice } from "@reduxjs/toolkit";

// Helper function to calculate total from items
const calculateTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
};

// Always start with empty state to avoid hydration mismatch
const initialState = {
  items: [],
  total: 0,
  isHydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    hydrateCart: (state, action) => {
      const savedCart = action.payload;
      state.items = Array.isArray(savedCart.items)
        ? savedCart.items.map((item) => ({
            ...item,
            // Ensure cartItemId exists, or create it if missing (for legacy data)
            cartItemId: item.cartItemId || `${item._id}-${item.selectedSize || "nosize"}`,
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 0),
          }))
        : [];
      // Recalculate total based on items to ensure accuracy
      state.total = calculateTotal(state.items);
      state.isHydrated = true;
    },

    addToCart: (state, action) => {
      // Ensure state.items is always an array
      if (!state.items) state.items = [];

      const payload = {
        ...action.payload,
        price: Number(action.payload.price || 0),
        selectedSize: action.payload.selectedSize || null,
      };

      // Create a unique identifier for each product/size combination
      const cartItemId = `${payload._id}-${payload.selectedSize || "nosize"}`;

      const existingItem = state.items.find(
        (item) => item.cartItemId === cartItemId
      );

      if (existingItem) {
        // Item already exists, just increase quantity
        existingItem.quantity += 1;
        state.total += payload.price;
      } else {
        // New item
        state.items.push({
          ...payload,
          cartItemId, // Add the unique ID to the cart item
          quantity: 1,
        });
        state.total += payload.price;
      }
    },

    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.cartItemId === action.payload);
      if (item) {
        item.quantity += 1;
        state.total += item.price;
      }
    },

    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.cartItemId === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          state.total -= item.price;
        } else {
          // If quantity is 1, remove the item
          state.total -= item.price;
          state.items = state.items.filter((i) => i.cartItemId !== action.payload);
        }
      }
    },

    removeFromCart: (state, action) => {
      // Ensure state.items is always an array
      if (!state.items) state.items = [];
      
      const itemToRemove = state.items.find(
        (item) => item.cartItemId === action.payload
      );

      if (!itemToRemove) return;

      state.total -= itemToRemove.price * itemToRemove.quantity;

      state.items = state.items.filter(
        (item) => item.cartItemId !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
