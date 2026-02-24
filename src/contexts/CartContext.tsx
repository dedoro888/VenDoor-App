import { createContext, useContext, useState, ReactNode } from "react";
import { FoodItem } from "@/data/mockData";

export interface CartItem {
  food: FoodItem;
  quantity: number;
  deliveryType: "pickup" | "delivery";
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  stage: 1 | 2 | 3; // 1=cooked/packed, 2=rider pickup, 3=received
  vendorName: string;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (food: FoodItem, quantity: number, deliveryType: "pickup" | "delivery") => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: () => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (food: FoodItem, quantity: number, deliveryType: "pickup" | "delivery") => {
    setItems((prev) => {
      const existing = prev.find((i) => i.food.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.food.id === food.id ? { ...i, quantity: i.quantity + quantity, deliveryType } : i
        );
      }
      return [...prev, { food, quantity, deliveryType }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setItems((prev) => prev.filter((i) => i.food.id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.food.id === foodId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);

  const placeOrder = (): Order => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...items],
      total: cartTotal,
      date: new Date().toISOString(),
      stage: 1,
      vendorName: items[0]?.food.shopName || "VenDoor",
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  return (
    <CartContext.Provider value={{ items, orders, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
