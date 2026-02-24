import { Home, Search, Compass, ClipboardList, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  active: string;
  onSearch?: () => void;
}

const tabs = [
  { id: "home", icon: Home, path: "/" },
  { id: "search", icon: Search, path: "" },
  { id: "discover", icon: Compass, path: "/discover" },
  { id: "orders", icon: ClipboardList, path: "/orders" },
  { id: "profile", icon: User, path: "/profile" },
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
    <nav className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-md mx-auto px-6">
        <div
          className="pointer-events-auto relative flex items-center justify-around py-3 rounded-[28px]"
          style={{
            background: "linear-gradient(135deg, hsla(0,0%,100%,0.45) 0%, hsla(0,0%,100%,0.25) 100%)",
            backdropFilter: "blur(24px) saturate(1.8)",
            WebkitBackdropFilter: "blur(24px) saturate(1.8)",
            boxShadow: "0 8px 32px hsla(0,0%,0%,0.12), inset 0 1px 0 hsla(0,0%,100%,0.6), inset 0 -1px 0 hsla(0,0%,0%,0.05)",
            border: "1px solid hsla(0,0%,100%,0.5)",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTap(tab)}
                className="relative flex items-center justify-center transition-all duration-300 ease-out"
                style={{ zIndex: isActive ? 10 : 1 }}
              >
                {/* Active pill that extends beyond nav */}
                {isActive && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full animate-scale-in"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--vendoor-amber)) 100%)",
                      boxShadow: "0 4px 20px hsla(28,92%,52%,0.45), inset 0 1px 0 hsla(0,0%,100%,0.4)",
                    }}
                  />
                )}
                <Icon
                  className={`relative w-5 h-5 transition-all duration-300 ${
                    isActive ? "text-primary-foreground scale-110" : "text-muted-foreground"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
