import { Home, Search, Compass, ClipboardList, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useRef, useMemo, useEffect, useState } from "react";

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

const BUBBLE_SIZE = 50;

const BottomNav = ({ active, onSearch }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useCart();
  const lastTap = useRef<Record<string, number>>({});
  const barRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);

  const activeOrderCount = orders.filter(
    (o) => o.paymentStatus === "paid" && !o.cancelled && o.stage < 3
  ).length;

  const activeIndex = useMemo(
    () => tabs.findIndex((t) => t.id === active),
    [active]
  );

  useEffect(() => {
    if (barRef.current) {
      const obs = new ResizeObserver((entries) => {
        for (const e of entries) setBarWidth(e.contentRect.width);
      });
      obs.observe(barRef.current);
      return () => obs.disconnect();
    }
  }, []);

  const handleTap = (tab: (typeof tabs)[0]) => {
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

  const slotWidth = barWidth > 0 ? barWidth / tabs.length : 0;
  const bubbleCenterX = slotWidth * activeIndex + slotWidth / 2;
  const notchW = 72;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="w-full max-w-md px-4 pb-3 pointer-events-auto">
        <div className="relative">
          {/* Bubble */}
          {barWidth > 0 && (
            <div
              className="absolute z-10 flex items-center justify-center transition-all duration-[500ms]"
              style={{
                width: BUBBLE_SIZE,
                height: BUBBLE_SIZE,
                borderRadius: "50%",
                background: "hsl(var(--primary))",
                boxShadow:
                  "0 4px 20px hsl(var(--primary) / 0.4), 0 0 0 3.5px hsl(var(--card))",
                top: -(BUBBLE_SIZE / 2) + 8,
                left: bubbleCenterX - BUBBLE_SIZE / 2,
                transitionTimingFunction:
                  "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {tabs[activeIndex] &&
                (() => {
                  const ActiveIcon = tabs[activeIndex].icon;
                  return (
                    <ActiveIcon
                      style={{
                        color: "hsl(var(--primary-foreground))",
                        width: 21,
                        height: 21,
                        strokeWidth: 2.4,
                      }}
                    />
                  );
                })()}
            </div>
          )}

          {/* Notch SVG */}
          {barWidth > 0 && (
            <svg
              className="absolute z-[5] pointer-events-none transition-all duration-[500ms]"
              style={{
                top: -12,
                left: bubbleCenterX - notchW / 2,
                transitionTimingFunction:
                  "cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              width={notchW}
              height="24"
              viewBox="0 0 72 24"
              fill="none"
            >
              <path
                d="M0 24C8 24 14 22 20 14C26 6 30 0 36 0C42 0 46 6 52 14C58 22 64 24 72 24"
                fill="hsl(var(--card))"
              />
            </svg>
          )}

          {/* Bar */}
          <div
            ref={barRef}
            className="relative flex items-center justify-around rounded-[20px] overflow-visible"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border) / 0.4)",
              boxShadow:
                "0 -1px 16px hsl(0 0% 0% / 0.15), 0 6px 28px hsl(0 0% 0% / 0.2)",
              padding: "10px 0 8px",
            }}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeIndex === index;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTap(tab)}
                  className="relative flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300"
                  style={{
                    height: 40,
                    transitionTimingFunction:
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {/* Icon — hidden when active (bubble shows it) */}
                  <div
                    className="relative flex items-center justify-center w-6 h-6 transition-all duration-300"
                    style={{
                      opacity: isActive ? 0 : 1,
                      transform: isActive ? "scale(0.6) translateY(-4px)" : "scale(1)",
                    }}
                  >
                    <Icon
                      style={{
                        color: "hsl(var(--muted-foreground))",
                        width: 20,
                        height: 20,
                        strokeWidth: 1.7,
                      }}
                    />
                    {tab.id === "orders" && activeOrderCount > 0 && !isActive && (
                      <span
                        className="absolute -top-1 -right-2 min-w-[15px] h-[15px] rounded-full text-[8px] font-bold flex items-center justify-center px-0.5 z-20"
                        style={{
                          background: "hsl(var(--destructive))",
                          color: "hsl(var(--destructive-foreground))",
                        }}
                      >
                        {activeOrderCount > 9 ? "9+" : activeOrderCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="text-[9px] font-semibold leading-none transition-all duration-300"
                    style={{
                      color: isActive
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                      opacity: isActive ? 1 : 0.7,
                      transform: isActive ? "translateY(6px)" : "translateY(0)",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
