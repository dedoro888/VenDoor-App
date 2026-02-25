import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";
import food4 from "@/assets/food-4.jpg";
import food5 from "@/assets/food-5.jpg";
import food6 from "@/assets/food-6.jpg";

export interface Shop {
  id: string;
  name: string;
  image: string;
  deliveryFee: number;
  deliveryTime: string;
  rating: number;
  reviews: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  discount?: number;
  categories: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  shopId: string;
  shopName: string;
  isOpen: boolean;
  category: string;
}

export const shops: Shop[] = [
  { id: "1", name: "Mama's Kitchen", image: food1, deliveryFee: 800, deliveryTime: "25min", rating: 4.5, reviews: "3,200+", isOpen: true, openTime: "8:00 AM", closeTime: "10:00 PM", discount: 10, categories: ["Rice", "Soups", "Drinks"] },
  { id: "2", name: "Labrix Eateries", image: food2, deliveryFee: 900, deliveryTime: "30min", rating: 3.8, reviews: "4,000+", isOpen: true, openTime: "9:00 AM", closeTime: "11:00 PM", categories: ["Rice", "Wraps", "Drinks"] },
  { id: "3", name: "Chip Chop Grill", image: food4, deliveryFee: 1000, deliveryTime: "35min", rating: 4.2, reviews: "2,000+", isOpen: false, openTime: "10:00 AM", closeTime: "9:00 PM", categories: ["Wraps", "Snacks", "Drinks"] },
  { id: "4", name: "Lola's Cafe", image: food3, deliveryFee: 800, deliveryTime: "30min", rating: 3.9, reviews: "2,000+", isOpen: true, openTime: "7:00 AM", closeTime: "10:00 PM", discount: 15, categories: ["Rice", "Soups", "Wraps"] },
  { id: "5", name: "The Bahamas Hotel", image: food5, deliveryFee: 800, deliveryTime: "30min", rating: 3.9, reviews: "2,000+", isOpen: true, openTime: "6:00 AM", closeTime: "11:00 PM", categories: ["Rice", "Soups", "Drinks", "Wraps"] },
  { id: "6", name: "Spice Junction", image: food6, deliveryFee: 700, deliveryTime: "20min", rating: 4.6, reviews: "5,100+", isOpen: true, openTime: "8:00 AM", closeTime: "10:30 PM", discount: 5, categories: ["Rice", "Wraps", "Snacks"] },
];

export const foodItems: FoodItem[] = [
  { id: "f1", name: "Jollof Rice & Chicken", description: "Smoky party-style jollof with grilled chicken", image: food1, price: 3500, shopId: "1", shopName: "Mama's Kitchen", isOpen: true, category: "Rice" },
  { id: "f2", name: "Pepper Soup", description: "Spicy catfish pepper soup with utazi", image: food2, price: 2800, shopId: "2", shopName: "Labrix Eateries", isOpen: true, category: "Soups" },
  { id: "f3", name: "Grilled Fish & Rice", description: "Fresh tilapia with coconut rice", image: food3, price: 4200, shopId: "4", shopName: "Lola's Cafe", isOpen: true, category: "Rice" },
  { id: "f4", name: "Suya Skewers", description: "Spiced beef suya with onions & tomatoes", image: food4, price: 2000, shopId: "3", shopName: "Chip Chop Grill", isOpen: false, category: "Snacks" },
  { id: "f5", name: "Yam Porridge", description: "Creamy yam pottage with spinach", image: food5, price: 1800, shopId: "5", shopName: "The Bahamas Hotel", isOpen: true, category: "Rice" },
  { id: "f6", name: "Shawarma & Fries", description: "Loaded chicken shawarma with crispy fries", image: food6, price: 3200, shopId: "6", shopName: "Spice Junction", isOpen: true, category: "Wraps" },
  { id: "f7", name: "Fried Rice Special", description: "Chinese-style fried rice with prawns", image: food3, price: 4000, shopId: "1", shopName: "Mama's Kitchen", isOpen: true, category: "Rice" },
  { id: "f8", name: "Chicken Wrap", description: "Grilled chicken tortilla wrap", image: food6, price: 2500, shopId: "2", shopName: "Labrix Eateries", isOpen: true, category: "Wraps" },
  { id: "f9", name: "Egusi Soup", description: "Rich melon seed soup with assorted meat", image: food1, price: 3000, shopId: "1", shopName: "Mama's Kitchen", isOpen: true, category: "Soups" },
  { id: "f10", name: "Chapman Drink", description: "Classic Nigerian cocktail mocktail", image: food2, price: 1500, shopId: "2", shopName: "Labrix Eateries", isOpen: true, category: "Drinks" },
];

export const categories = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "Breakfast", label: "Breakfast", emoji: "🍳" },
  { id: "Lunch", label: "Lunch", emoji: "🍛" },
  { id: "Dinner", label: "Dinner", emoji: "🌙" },
  { id: "Snacks", label: "Snacks", emoji: "🍿" },
];

export const locations = [
  "Nasarawa", "Karu", "Mararaba", "Nyanya", "Jikwoyi", "Keffi", "Lafia", "Abuja", "Garki", "Wuse"
];
