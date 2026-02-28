import { createContext, useContext, useState, ReactNode } from "react";
import { FoodItem } from "@/data/mockData";

export interface CartItem {
  food: FoodItem;
  quantity: number;
  deliveryType: "pickup" | "delivery";
  note?: string;
  scheduledFor?: string;
  promoCode?: string;
  promoDiscount?: number;
}

export type OrderStage = 1 | 2 | 3;

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  stage: OrderStage;
  vendorName: string;
  note?: string;
  scheduledFor?: string;
  cancelled?: boolean;
  promoCode?: string;
  promoDiscount?: number;
  deliveryType: "pickup" | "delivery";
  paymentStatus: "pending" | "paid" | "failed";
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (food: FoodItem, quantity: number, deliveryType: "pickup" | "delivery", note?: string, scheduledFor?: string, promoCode?: string, promoDiscount?: number) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  placeOrder: (note?: string, scheduledFor?: string, promoCode?: string, promoDiscount?: number, deliveryType?: "pickup" | "delivery") => Order;
  confirmPayment: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  advanceOrderStage: (orderId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (
    food: FoodItem,
    quantity: number,
    deliveryType: "pickup" | "delivery",
    note?: string,
    scheduledFor?: string,
    promoCode?: string,
    promoDiscount?: number
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.food.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.food.id === food.id ? { ...i, quantity: i.quantity + quantity, deliveryType, note, scheduledFor, promoCode, promoDiscount } : i
        );
      }
      return [...prev, { food, quantity, deliveryType, note, scheduledFor, promoCode, promoDiscount }];
    });
  };

  const removeFromCart = (foodId: string) => {
    setItems((prev) => prev.filter((i) => i.food.id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(foodId); return; }
    setItems((prev) => prev.map((i) => (i.food.id === foodId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, i) => {
    const base = i.food.price * i.quantity;
    const discount = i.promoDiscount ? base * (i.promoDiscount / 100) : 0;
    return sum + base - discount;
  }, 0);

  const placeOrder = (
    note?: string,
    scheduledFor?: string,
    promoCode?: string,
    promoDiscount?: number,
    deliveryType: "pickup" | "delivery" = "delivery"
  ): Order => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...items],
      total: cartTotal,
      date: new Date().toISOString(),
      stage: 1,
      vendorName: items[0]?.food.shopName || "VenDoor",
      note,
      scheduledFor,
      promoCode,
      promoDiscount,
      deliveryType,
      paymentStatus: "pending",
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const confirmPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, paymentStatus: "paid" } : o)
    );
    // Simulate order progression
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === orderId && o.paymentStatus === "paid" ? { ...o, stage: 1 } : o));
    }, 500);
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, stage: 2 } : o));
    }, 15000);
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, stage: 3 } : o));
    }, 30000);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, cancelled: true } : o));
  };

  const advanceOrderStage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.stage < 3) {
          return { ...o, stage: (o.stage + 1) as OrderStage };
        }
        return o;
      })
    );
  };

  return (
    <CartContext.Provider value={{ items, orders, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, placeOrder, confirmPayment, cancelOrder, advanceOrderStage }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
