import { foodItems, shops, FoodItem } from "@/data/mockData";
import { Star, ArrowRight } from "lucide-react";
import FoodCard from "@/components/FoodCard";

interface MealSectionProps {
  title: string;
  filterFn?: (s: typeof shops[0]) => boolean;
  onFoodTap: (food: FoodItem) => void;
}

const MealSection = ({ title, filterFn, onFoodTap }: MealSectionProps) => {
  // Get food items from filtered shops
  const filteredShopIds = filterFn
    ? shops.filter(filterFn).map((s) => s.id)
    : shops.map((s) => s.id);

  const sectionFoods = foodItems.filter((f) => filteredShopIds.includes(f.shopId));

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <button className="p-2 rounded-full bg-secondary">
          <ArrowRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
      <div className="flex gap-3 px-5 overflow-x-auto hide-scrollbar pb-2">
        {sectionFoods.map((food) => (
          <FoodCard key={food.id} food={food} onTap={onFoodTap} />
        ))}
      </div>
    </section>
  );
};

export default MealSection;
