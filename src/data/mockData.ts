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
}

export interface FoodItem {
  id: string;
  name: string;
  image: string;
  price: number;
  shopId: string;
  shopName: string;
  isOpen: boolean;
  category: string;
}

export const shops: Shop[] = [
  { id: "1", name: "Mama's Kitchen", image: food1, deliveryFee: 800, deliveryTime: "25min", rating: 4.5, reviews: "3,200+", isOpen: true },
  { id: "2", name: "Labrix Eateries", image: food2, deliveryFee: 900, deliveryTime: "30min", rating: 3.8, reviews: "4,000+", isOpen: true },
  { id: "3", name: "Chip Chop Grill", image: food4, deliveryFee: 1000, deliveryTime: "35min", rating: 4.2, reviews: "2,000+", isOpen: false },
  { id: "4", name: "Lola's Cafe", image: food3, deliveryFee: 800, deliveryTime: "30min", rating: 3.9, reviews: "2,000+", isOpen: true },
  { id: "5", name: "The Bahamas Hotel", image: food5, deliveryFee: 800, deliveryTime: "30min", rating: 3.9, reviews: "2,000+", isOpen: true },
  { id: "6", name: "Spice Junction", image: food6, deliveryFee: 700, deliveryTime: "20min", rating: 4.6, reviews: "5,100+", isOpen: true },
];

export const foodItems: FoodItem[] = [
  { id: "f1", name: "Jollof Rice & Chicken", image: food1, price: 3500, shopId: "1", shopName: "Mama's Kitchen", isOpen: true, category: "Lunch" },
  { id: "f2", name: "Pepper Soup", image: food2, price: 2800, shopId: "2", shopName: "Labrix Eateries", isOpen: true, category: "Dinner" },
  { id: "f3", name: "Grilled Fish & Rice", image: food3, price: 4200, shopId: "4", shopName: "Lola's Cafe", isOpen: true, category: "Lunch" },
  { id: "f4", name: "Suya Skewers", image: food4, price: 2000, shopId: "3", shopName: "Chip Chop Grill", isOpen: false, category: "Snacks" },
  { id: "f5", name: "Yam Porridge", image: food5, price: 1800, shopId: "5", shopName: "The Bahamas Hotel", isOpen: true, category: "Breakfast" },
  { id: "f6", name: "Shawarma & Fries", image: food6, price: 3200, shopId: "6", shopName: "Spice Junction", isOpen: true, category: "Snacks" },
  { id: "f7", name: "Fried Rice Special", image: food3, price: 4000, shopId: "1", shopName: "Mama's Kitchen", isOpen: true, category: "Lunch" },
  { id: "f8", name: "Chicken Wrap", image: food6, price: 2500, shopId: "2", shopName: "Labrix Eateries", isOpen: true, category: "Breakfast" },
];

export const categories = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "Breakfast", label: "Breakfast", emoji: "🍳" },
  { id: "Lunch", label: "Lunch", emoji: "🍛" },
  { id: "Dinner", label: "Dinner", emoji: "🌙" },
  { id: "Snacks", label: "Snacks", emoji: "🍿" },
];
