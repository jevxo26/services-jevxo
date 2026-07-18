import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  title: string;
  image: string;
  priceDisplay: string;
  price: number;
  categoryLabel: string;
  rating: number;
  slug?: string;
  addedAt: string; // ISO timestamp
}

interface WishlistState {
  items: WishlistItem[];
}

const STORAGE_KEY = 'jevxo services_wishlist';

function loadFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [] as WishlistItem[],
  } as WishlistState,
  reducers: {
    restoreWishlist: (state) => {
      state.items = loadFromStorage();
    },
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) {
        state.items.splice(idx, 1);
      } else {
        state.items.push({ ...action.payload, addedAt: new Date().toISOString() });
      }
      saveToStorage(state.items);
    },
    removeWishlistItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveToStorage([]);
    },
  },
});

export const { restoreWishlist, toggleWishlist, removeWishlistItem, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
