import { useState } from "react";
import { FoodItem } from "@/data/mockData";
import AppHeader from "@/components/AppHeader";
import CategoryFilter from "@/components/CategoryFilter";
import TopPlaces from "@/components/TopPlaces";
import MealSection from "@/components/MealSection";
import BottomNav from "@/components/BottomNav";
import SearchOverlay from "@/components/SearchOverlay";
import FoodItemModal from "@/components/FoodItemModal";
import FilterBar, { Filters } from "@/components/FilterBar";

const defaultFilters: Filters = {
  openNow: false,
  minDiscount: 0,
  priceRange: [0, 10000],
  minRating: 0,
  maxDistance: 20,
  maxDeliveryTime: 60,
  freeDelivery: false,
};

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.openNow ||
    filters.minDiscount > 0 ||
    filters.priceRange[1] < 10000 ||
    filters.minRating > 0 ||
    filters.freeDelivery ||
    filters.maxDeliveryTime < 60;

  return (
    /* Scaffold: full screen container, nav fixed outside scroll flow */
    <div className="max-w-md mx-auto h-screen flex flex-col bg-background relative">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overscroll-contain pb-24 page-enter">
        <AppHeader onFilterTap={() => setShowFilters(!showFilters)} hasActiveFilters={hasActiveFilters} />
        <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
        <TopPlaces filters={filters} onFoodTap={setSelectedFood} />
        <MealSection title="Meals under 5k" filterFn={(s) => s.deliveryFee <= 1000} onFoodTap={setSelectedFood} />
        <MealSection title="Save up on local brands" onFoodTap={setSelectedFood} />
        <div className="h-4" />
      </div>

      {/* Fixed bottom nav — outside scroll container */}
      <BottomNav active="home" onSearch={() => setSearchOpen(true)} />

      {/* Filter panel — slides up from nav bar height */}
      {showFilters && (
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
          defaultFilters={defaultFilters}
        />
      )}

      {/* Overlays */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onFoodTap={setSelectedFood} />
      <FoodItemModal food={selectedFood} onClose={() => setSelectedFood(null)} />
    </div>
  );
};

export default Index;
