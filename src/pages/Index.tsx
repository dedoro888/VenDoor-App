import { useState } from "react";
import { Search } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import CategoryFilter from "@/components/CategoryFilter";
import TopPlaces from "@/components/TopPlaces";
import MealSection from "@/components/MealSection";
import BottomNav from "@/components/BottomNav";
import SearchOverlay from "@/components/SearchOverlay";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    if (tab === "search") {
      setSearchOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative">
      <AppHeader />

      {/* Search bar */}
      <div className="px-5 mb-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-sm text-muted-foreground"
        >
          <Search className="w-4 h-4" />
          Search for shops or food items...
        </button>
      </div>

      <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />

      <TopPlaces />

      <MealSection title="Meals under 5k" filterFn={(s) => s.deliveryFee <= 1000} />

      <MealSection title="Save up on local brands" />

      {/* Bottom spacing for nav */}
      <div className="h-24" />

      <BottomNav active={activeTab} onNavigate={handleNavigate} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default Index;
