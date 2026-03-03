import { Home, Search, Compass, ClipboardList, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

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
  const { orders } = useCart();

  const activeOrderCount = orders.filter(
    (o) => o.paymentStatus === "paid" && !o.cancelled && o.stage < 3
  ).length;

  const handleTap = (tab: typeof tabs[0]) => {
    if (tab.id === "search" && onSearch) {
      onSearch();
    } else if (tab.path) {
      navigate(tab.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* Safe area / gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      <div className="max-w-md mx-auto px-4 pb-3 pt-2 relative">
        <div
          className="pointer-events-auto relative flex items-center justify-around py-2 px-1 rounded-[28px]"
          style={{
            background: "linear-gradient(135deg, hsla(0,0%,100%,0.55) 0%, hsla(0,0%,100%,0.35) 100%)",
            backdropFilter: "blur(28px) saturate(1.9)",
            WebkitBackdropFilter: "blur(28px) saturate(1.9)",
            boxShadow: "0 8px 32px hsla(0,0%,0%,0.14), inset 0 1px 0 hsla(0,0%,100%,0.7), inset 0 -1px 0 hsla(0,0%,0%,0.06)",
            border: "1px solid hsla(0,0%,100%,0.55)",
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTap(tab)}
                className="relative flex flex-col items-center justify-center transition-all duration-300 ease-out w-14 py-1 gap-0.5"
                style={{ zIndex: isActive ? 10 : 1 }}
              >
                {/* Active pill background */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-2xl animate-scale-in"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary) / 0.18) 0%, hsl(var(--accent) / 0.25) 100%)",
                    }}
                  />
                )}

                <div className="relative w-8 h-8 flex items-center justify-center">
                  {/* Active dot indicator */}
                  {isActive && (
                    <div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: "hsl(var(--primary))" }}
                    />
                  )}
                  <Icon
                    className={`relative w-5 h-5 transition-all duration-300 ${
                      isActive
                        ? "scale-110"
                        : "text-muted-foreground"
                    }`}
                    style={isActive ? { color: "hsl(var(--primary))" } : {}}
                  />
                  {/* Orders badge */}
                  {tab.id === "orders" && activeOrderCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 z-20"
                      style={{
                        background: "hsl(var(--destructive))",
                        color: "hsl(var(--primary-foreground))",
                      }}
                    >
                      {activeOrderCount > 9 ? "9+" : activeOrderCount}
                    </span>
                  )}
                </div>

                <span
                  className={`relative text-[10px] font-semibold transition-all duration-300 leading-none ${
                    isActive ? "" : "text-muted-foreground"
                  }`}
                  style={isActive ? { color: "hsl(var(--primary))" } : {}}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
