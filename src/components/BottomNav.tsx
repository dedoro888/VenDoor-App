import { Home, Search, Compass, ClipboardList, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useRef, useMemo, useEffect, useState, useCallback } from "react";

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

const BUBBLE_SIZE = 52;
const NOTCH_W = 74;
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const DURATION = "500ms";

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
    if (!barRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) setBarWidth(e.contentRect.width);
    });
    obs.observe(barRef.current);
    return () => obs.disconnect();
  }, []);

  const handleTap = useCallback(
    (tab: (typeof tabs)[0]) => {
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
    },
    [location.pathname, navigate, onSearch]
  );

  const slotWidth = barWidth > 0 ? barWidth / tabs.length : 0;
  const bubbleCenterX = slotWidth * activeIndex + slotWidth / 2;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="w-full max-w-md px-4 pb-3 pointer-events-auto">
        <div className="relative">
          {/* ── Floating bubble ── */}
          {barWidth > 0 && (
            <div
              className="absolute z-10 flex items-center justify-center"
              style={{
                width: BUBBLE_SIZE,
                height: BUBBLE_SIZE,
                borderRadius: "50%",
                background: "hsl(var(--foreground))",
                boxShadow:
                  "0 4px 16px hsl(var(--foreground) / 0.25), 0 0 0 4px hsl(var(--card))",
                top: -(BUBBLE_SIZE / 2) + 10,
                left: bubbleCenterX - BUBBLE_SIZE / 2,
                transition: `left ${DURATION} ${SPRING}, top ${DURATION} ${SPRING}`,
                willChange: "left",
              }}
            >
              {tabs[activeIndex] &&
                (() => {
                  const Icon = tabs[activeIndex].icon;
                  return (
                    <Icon
                      style={{
                        color: "hsl(var(--background))",
                        width: 22,
                        height: 22,
                        strokeWidth: 2.2,
                      }}
                    />
                  );
                })()}
            </div>
          )}

          {/* ── Notch cutout ── */}
          {barWidth > 0 && (
            <svg
              className="absolute z-[5] pointer-events-none"
              style={{
                top: -13,
                left: bubbleCenterX - NOTCH_W / 2,
                transition: `left ${DURATION} ${SPRING}`,
                willChange: "left",
              }}
              width={NOTCH_W}
              height="24"
              viewBox="0 0 74 24"
              fill="none"
            >
              <path
                d="M0 24C8 24 15 22 21 14C27 6 31 0 37 0C43 0 47 6 53 14C59 22 66 24 74 24"
                fill="hsl(var(--card))"
              />
            </svg>
          )}

          {/* ── Bar ── */}
          <div
            ref={barRef}
            className="relative flex items-center justify-around rounded-[22px] overflow-visible"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border) / 0.35)",
              boxShadow:
                "0 -2px 20px hsl(0 0% 0% / 0.08), 0 8px 32px hsl(0 0% 0% / 0.18)",
              padding: "10px 0 10px",
            }}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeIndex === index;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTap(tab)}
                  className="relative flex flex-col items-center justify-center gap-[5px] flex-1"
                  style={{ height: 42 }}
                >
                  {/* Icon — fades when active */}
                  <div
                    className="relative flex items-center justify-center w-6 h-6"
                    style={{
                      opacity: isActive ? 0 : 0.7,
                      transform: isActive
                        ? "scale(0.5) translateY(-6px)"
                        : "scale(1) translateY(0)",
                      transition: `opacity 300ms ease, transform 350ms ${SPRING}`,
                    }}
                  >
                    <Icon
                      style={{
                        color: "hsl(var(--muted-foreground))",
                        width: 20,
                        height: 20,
                        strokeWidth: 1.6,
                      }}
                    />
                    {tab.id === "orders" && activeOrderCount > 0 && !isActive && (
                      <span
                        className="absolute -top-1 -right-2.5 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 z-20"
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
                    className="text-[10px] font-semibold leading-none"
                    style={{
                      color: isActive
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted-foreground))",
                      opacity: isActive ? 1 : 0.55,
                      fontWeight: isActive ? 700 : 500,
                      transform: isActive ? "translateY(7px)" : "translateY(0)",
                      transition: `all 350ms ${SPRING}`,
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
