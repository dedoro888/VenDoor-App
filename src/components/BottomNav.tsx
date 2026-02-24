import { Home, Search, ClipboardList, User, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  active: string;
  onSearch?: () => void;
}

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "search", label: "Search", icon: Search, path: "" },
  { id: "orders", label: "Orders", icon: ClipboardList, path: "/orders" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
  { id: "cart", label: "Cart", icon: ShoppingBag, path: "/cart" },
];

const BottomNav = ({ active, onSearch }: BottomNavProps) => {
  const navigate = useNavigate();

  const handleTap = (tab: typeof tabs[0]) => {
    if (tab.id === "search" && onSearch) {
      onSearch();
    } else if (tab.path) {
      navigate(tab.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTap(tab)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
