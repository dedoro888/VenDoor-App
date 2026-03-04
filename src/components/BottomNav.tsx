import { Home, Search, Compass, ClipboardList, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useRef } from "react";

interface BottomNavProps {
  active: string;
  onSearch?: () => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "search", icon: Search, label: "Search", path: "" },
  { id: "discover", icon: Compass, label: "Discover", path: "/discover" },
  { id: "orders", icon: ClipboardList, label: "Orders", path: "/orders" },
  { id: "profile", icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = ({ active, onSearch }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useCart();
  const lastTap = useRef<Record<string, number>>({});

  const activeOrderCount = orders.filter(
    (o) => o.paymentStatus === "paid" && !o.cancelled && o.stage < 3
  ).length;

  const handleTap = (tab: typeof tabs[0]) => {
    // Debounce: ignore taps within 400ms
    const now = Date.now();
    if (now - (lastTap.current[tab.id] ?? 0) < 400) return;
    lastTap.current[tab.id] = now;

    if (tab.id === "search" && onSearch) {
      onSearch();
      return;
    }
    if (tab.path && location.pathname !== tab.path) {
      navigate(tab.path);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="w-full max-w-md px-4 pb-3 pt-1 pointer-events-auto">
        <div
          className="flex items-center justify-around py-1.5 px-1 rounded-[24px]"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 -2px 20px hsl(0 0% 0% / 0.25), 0 4px 24px hsl(0 0% 0% / 0.2)",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTap(tab)}
                className="relative flex flex-col items-center justify-center w-14 py-2 gap-0.5 rounded-2xl transition-all duration-200"
                style={isActive ? { background: "hsl(var(--primary) / 0.12)" } : {}}
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <Icon
                    className="w-[18px] h-[18px] transition-all duration-200"
                    style={isActive
                      ? { color: "hsl(var(--primary))", strokeWidth: 2.5 }
                      : { color: "hsl(var(--muted-foreground))", strokeWidth: 1.8 }
                    }
                  />
                  {tab.id === "orders" && activeOrderCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] rounded-full text-[8px] font-bold flex items-center justify-center px-0.5 z-20"
                      style={{ background: "hsl(var(--destructive))", color: "white" }}
                    >
                      {activeOrderCount > 9 ? "9+" : activeOrderCount}
                    </span>
                  )}
                </div>
                <span
                  className="text-[9px] font-semibold leading-none transition-all duration-200"
                  style={isActive
                    ? { color: "hsl(var(--primary))" }
                    : { color: "hsl(var(--muted-foreground))" }
                  }
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
