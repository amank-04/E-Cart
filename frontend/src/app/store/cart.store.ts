import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CartItem } from '../../../typing';
import { computed } from '@angular/core';

interface CartItems {
  items: CartItem[];
}

const cartItems: CartItems = {
  items: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(cartItems),
  withComputed(({ items }) => ({
    totalPrice: computed(() =>
      items().reduce(
        (sum, item) => sum + (item.selected && item.price * item.count),
        0,
      ),
    ),

    selectedItemCount: computed(() =>
      items().reduce((count, item) => count + (item.selected && 1), 0),
    ),
  })),

  withMethods(({ items, ...store }) => ({
    addItem(newItem: CartItem) {
      const index = items().findIndex((item) => item.id === newItem.id);
      index !== -1 ? items()[index].count++ : items().push(newItem);
      patchState(store, { items: items() });

      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('cart_items', JSON.stringify(items()));
      }
    },

    incrementItemCount(id: String) {
      const newItems: CartItems = {
        items: items().filter((item) => id !== item.id || item.count++),
      };
      patchState(store, newItems);
      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('cart_items', JSON.stringify(items()));
      }
    },

    decrementItemCount(id: String) {
      const newItems: CartItems = {
        items: items().filter((item) => item.id !== id || --item.count),
      };
      patchState(store, newItems);
      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('cart_items', JSON.stringify(items()));
      }
    },

    handleSelectAllItems(select: Boolean) {
      const newItems: CartItems = {
        items: items().filter((item) => (item.selected = select) || true),
      };
      patchState(store, newItems);
      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('cart_items', JSON.stringify(items()));
      }
    },

    toggleItemSelection(id: String) {
      const newItems: CartItems = {
        items: items().filter((item) =>
          item.id !== id ? item : (item.selected = !item.selected) || true,
        ),
      };
      patchState(store, newItems);
      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('cart_items', JSON.stringify(items()));
      }
    },

    removeAllItem() {
      patchState(store, { items: [] });
    },

    initialCart(items: CartItem[]) {
      patchState(store, { items });
    },
  })),
);
