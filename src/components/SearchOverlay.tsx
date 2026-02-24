import { useState } from "react";
import { Search, X, MapPin } from "lucide-react";
import { foodItems, shops } from "@/data/mockData";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const nigerianFoodSuggestions = [
  "Jollof Rice", "Fried Rice", "Beans", "Pounded Yam", "Egusi Soup",
  "Pepper Soup", "Suya", "Shawarma", "Puff Puff", "Chin Chin",
  "Amala", "Efo Riro", "Ofada Rice", "Moi Moi", "Akara",
  "Banga Soup", "Ogbono Soup", "Cake", "Meat Pie", "Dodo",
  "Plantain", "Yam Porridge", "Nkwobi", "Asun", "Kilishi",
  "Zobo", "Chapman", "Chicken Wrap", "Grilled Fish", "Catfish",
];

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"food" | "shop">("food");

  if (!isOpen) return null;

  const matchingSuggestions = query.length > 0 && searchType === "food"
    ? nigerianFoodSuggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const filteredFood = query.length > 0
    ? foodItems.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredShops = query.length > 0
    ? shops.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const results = searchType === "food" ? filteredFood : filteredShops;

  const handleSuggestionTap = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 animate-slide-up">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === "food" ? "Search food items..." : "Search shops..."}
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 px-5 mb-4">
          <button
            onClick={() => setSearchType("food")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              searchType === "food" ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >
            🍛 Food Items
          </button>
          <button
            onClick={() => setSearchType("shop")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              searchType === "shop" ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >
            🏪 Shops
          </button>
        </div>

        {/* Suggestions */}
        {searchType === "food" && matchingSuggestions.length > 0 && filteredFood.length === 0 && (
          <div className="px-5 mb-4">
            <p className="text-xs text-muted-foreground mb-2">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {matchingSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionTap(s)}
                  className="px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="px-5 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {query.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-sm text-muted-foreground">
                Start typing to search for {searchType === "food" ? "food items" : "shops"}...
              </p>
              {searchType === "food" && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Try searching for</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Jollof Rice", "Shawarma", "Suya", "Beans", "Puff Puff", "Cake"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestionTap(s)}
                        className="px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {query.length > 0 && results.length === 0 && matchingSuggestions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center mt-10">
              No results found for "{query}"
            </p>
          )}

          {searchType === "food" && filteredFood.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                <p className="text-sm font-bold text-primary">₦{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{item.shopName}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.isOpen
                      ? "bg-vendoor-green/15 text-vendoor-green"
                      : "bg-destructive/15 text-destructive"
                  }`}>
                    {item.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {searchType === "shop" && filteredShops.map((shop) => (
            <div key={shop.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <img src={shop.image} alt={shop.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{shop.name}</h4>
                <p className="text-xs text-muted-foreground">{shop.deliveryFee} Delivery Fee • {shop.deliveryTime}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  shop.isOpen
                    ? "bg-vendoor-green/15 text-vendoor-green"
                    : "bg-destructive/15 text-destructive"
                }`}>
                  {shop.isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
