import { useState } from "react";
import { X, Minus, Plus, Sparkles, Calendar, Star, Bike, Tag, ChevronRight, MapPin, Clock, Navigation, ChevronDown } from "lucide-react";
import { FoodItem, shops, Addon } from "@/data/mockData";
import { useCart, CartAddon } from "@/contexts/CartContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const FourPointStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

const PROMO_CODES: Record<string, number> = {
  "VENDOOR10": 10,
  "SAVE20": 20,
  "FIRST50": 50,
};

interface FoodItemModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

const FoodItemModal = ({ food, onClose }: FoodItemModalProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery");
  const [note, setNote] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState("");
  const [promoError, setPromoError] = useState("");
  const [starPop, setStarPop] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});

  const { addToCart } = useCart();
  const { isFoodFav, toggleFoodFav } = useFavourites();

  if (!food) return null;

  const shop = shops.find((s) => s.id === food.shopId);
  const isFav = isFoodFav(food.id);
  const hasDiscount = !!food.originalPrice && food.originalPrice > food.price;

  // Addon calculations
  const addonTotal = (food.addons || []).reduce((sum, addon) => {
    return sum + addon.price * (addonQuantities[addon.id] || 0);
  }, 0);

  const basePrice = food.price * quantity;
  const addonsForOrder = addonTotal * quantity;
  const subtotal = basePrice + addonsForOrder;
  const discountAmount = promoDiscount ? Math.round(subtotal * (promoDiscount / 100)) : 0;
  const totalPrice = subtotal - discountAmount;

  const updateAddonQty = (addonId: string, delta: number) => {
    setAddonQuantities((prev) => {
      const current = prev[addonId] || 0;
      const next = Math.max(0, Math.min(10, current + delta));
      return { ...prev, [addonId]: next };
    });
  };

  const applyPromo = () => {
    const discount = PROMO_CODES[promoInput.toUpperCase()];
    if (discount) {
      setPromoDiscount(discount);
      setPromoApplied(promoInput.toUpperCase());
      setPromoError("");
      toast({ title: `Promo applied! ${discount}% off` });
    } else {
      setPromoError("Invalid promo code");
      setPromoDiscount(0);
      setPromoApplied("");
    }
  };

  const handleAddToOrders = () => {
    const scheduledFor = scheduleDate && scheduleTime ? `${scheduleDate}T${scheduleTime}` : undefined;
    const cartAddons: CartAddon[] = (food.addons || [])
      .filter((a) => (addonQuantities[a.id] || 0) > 0)
      .map((a) => ({ addon: a, quantity: addonQuantities[a.id] }));

    addToCart(food, quantity, deliveryType, note || undefined, scheduledFor, promoApplied || undefined, promoDiscount || undefined, cartAddons.length > 0 ? cartAddons : undefined);
    toast({ title: "Added to Cart!", description: `${quantity}x ${food.name}` });
    onClose();
  };

  const handleFavToggle = () => {
    toggleFoodFav(food.id);
    setStarPop(true);
    setTimeout(() => setStarPop(false), 300);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-card rounded-t-[28px] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col slide-up-from-nav"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 flex-shrink-0">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

          <button onClick={onClose} className="absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md"
            style={{ background: "hsl(0 0% 0% / 0.45)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleFavToggle}
            className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-colors"
            style={{
              background: isFav ? "hsl(var(--destructive) / 0.3)" : "hsl(0 0% 0% / 0.45)",
              color: isFav ? "hsl(var(--destructive))" : "white",
            }}
          >
            <FourPointStar filled={isFav} className={`w-5 h-5 ${starPop ? "star-pop" : ""}`} />
          </button>

          {/* Discount badge on image */}
          {hasDiscount && food.discount && (
            <div className="absolute bottom-3 left-4 px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{ background: "hsl(var(--destructive))", color: "white" }}>
              -{food.discount}% OFF
            </div>
          )}

          {!food.isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-sm font-bold text-white bg-destructive px-3 py-1.5 rounded-full">Currently Closed</span>
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Item name + price row */}
          <div>
            <h2 className="text-2xl font-black" style={{ color: "hsl(var(--foreground))" }}>{food.name}</h2>

            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
              <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{food.shopName}</span>
              <span
                className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={food.isOpen
                  ? { background: "hsl(177 98% 19% / 0.2)", color: "hsl(177 98% 35%)" }
                  : { background: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }
                }
              >
                {food.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            {/* Price with discount */}
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black" style={{ color: "hsl(var(--primary))" }}>
                ₦{food.price.toLocaleString()}
              </p>
              {hasDiscount && (
                <span className="text-base line-through" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>
                  ₦{food.originalPrice!.toLocaleString()}
                </span>
              )}
              {hasDiscount && food.discount && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "hsl(177 98% 19% / 0.2)", color: "hsl(177 98% 35%)" }}>
                  Save ₦{(food.originalPrice! - food.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Rating + time + orders row */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {shop && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" style={{ fill: "hsl(var(--vendoor-amber))", color: "hsl(var(--vendoor-amber))" }} />
                  <span className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>{shop.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{shop?.deliveryTime ?? "—"}</span>
              </div>
              {food.orderCount && food.orderCount > 50 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: "hsl(var(--vendoor-orange))" }}>🔥</span>
                  <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{food.orderCount}+ orders</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>₦{shop?.deliveryFee?.toLocaleString() ?? "—"}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "hsl(var(--muted-foreground))",
                display: "-webkit-box",
                WebkitLineClamp: descExpanded ? "unset" : 2,
                WebkitBoxOrient: "vertical",
                overflow: descExpanded ? "visible" : "hidden",
              } as React.CSSProperties}
            >
              {food.description}
            </p>
            <button
              onClick={() => setDescExpanded(!descExpanded)}
              className="flex items-center gap-1 text-xs font-semibold mt-1"
              style={{ color: "hsl(var(--primary))" }}
            >
              {descExpanded ? "Show less" : "Show more"}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${descExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* ── ADD-ONS / EXTRAS ── */}
          {food.addons && food.addons.length > 0 && (
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>
                Add Extras <span className="font-normal text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>(Optional)</span>
              </h3>
              <div className="space-y-2">
                {food.addons.map((addon) => {
                  const qty = addonQuantities[addon.id] || 0;
                  return (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-2xl transition-colors"
                      style={{
                        background: qty > 0 ? "hsl(var(--primary) / 0.08)" : "hsl(var(--muted))",
                        border: qty > 0 ? "1px solid hsl(var(--primary) / 0.25)" : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>
                          {addon.name}
                        </span>
                        <span className="text-xs font-semibold flex-shrink-0" style={{ color: "hsl(var(--primary))" }}>
                          ₦{addon.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateAddonQty(addon.id, -1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            background: qty > 0 ? "hsl(var(--muted))" : "transparent",
                            color: "hsl(var(--foreground))",
                            opacity: qty > 0 ? 1 : 0.3,
                          }}
                          disabled={qty === 0}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span
                          className="text-sm font-bold w-4 text-center"
                          style={{ color: qty > 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                        >
                          {qty}
                        </span>
                        <button
                          onClick={() => updateAddonQty(addon.id, 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: "hsl(var(--primary))", color: "white" }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vendor mini card */}
          {shop && (
            <button
              onClick={() => { onClose(); navigate(`/vendor/${shop.id}`); }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-[0.98]"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
            >
              <img src={shop.image} alt={shop.name} className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{shop.name}</p>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <Star className="w-3 h-3" style={{ fill: "hsl(var(--vendoor-amber))", color: "hsl(var(--vendoor-amber))" }} />
                  <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{shop.rating}</span>
                  <span>•</span>
                  <span>{shop.reviews} orders</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          )}

          {/* Pickup / Delivery */}
          <div className="flex gap-2">
            {(["delivery", "pickup"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDeliveryType(type)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
                style={deliveryType === type
                  ? { background: "hsl(var(--primary))", color: "white", boxShadow: "0 4px 12px hsl(var(--primary) / 0.35)" }
                  : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                }
              >
                {type === "delivery" ? (
                  <><Bike className="w-4 h-4" /> Delivery</>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    Pickup
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Schedule */}
          <button
            onClick={() => setScheduling(!scheduling)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-colors"
            style={scheduling
              ? { background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }
              : { background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }
            }
          >
            <Calendar className="w-4 h-4" />
            {scheduling ? "Cancel Schedule" : "Schedule Order"}
          </button>

          {scheduling && (
            <div className="flex gap-2">
              <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))", border: "none" }}
                min={new Date().toISOString().split("T")[0]} />
              <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))", border: "none" }} />
            </div>
          )}

          {/* Promo code */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl"
              style={{ background: "hsl(var(--muted))" }}>
              <Tag className="w-3.5 h-3.5" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                placeholder="Promo code"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "hsl(var(--foreground))" }} />
            </div>
            <button onClick={applyPromo}
              className="px-4 py-2 rounded-2xl text-xs font-bold"
              style={{ background: "hsl(var(--primary))", color: "white" }}>
              Apply
            </button>
          </div>
          {promoError && <p className="text-xs" style={{ color: "hsl(var(--destructive))" }}>{promoError}</p>}
          {promoApplied && <p className="text-xs" style={{ color: "hsl(177 98% 35%)" }}>✓ {promoApplied} applied — {promoDiscount}% off</p>}

          {/* Note */}
          <textarea placeholder="Special instructions (e.g., less pepper, no onions)..."
            value={note} onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl text-sm resize-none h-16 outline-none"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))", border: "none" }} />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>Quantity</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}>
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-black w-6 text-center" style={{ color: "hsl(var(--foreground))" }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "hsl(var(--primary))", color: "white" }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed CTA — breakdown + Add to cart */}
        <div className="px-5 pb-5 pt-3 flex-shrink-0"
          style={{ borderTop: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
          {/* Price breakdown */}
          {(addonTotal > 0 || promoDiscount > 0) && (
            <div className="space-y-1 mb-2 text-xs px-1">
              <div className="flex justify-between">
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Base ({quantity}x ₦{food.price.toLocaleString()})</span>
                <span style={{ color: "hsl(var(--foreground))" }}>₦{basePrice.toLocaleString()}</span>
              </div>
              {addonTotal > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>Extras</span>
                  <span style={{ color: "hsl(var(--foreground))" }}>₦{addonsForOrder.toLocaleString()}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "hsl(177 98% 35%)" }}>Discount (-{promoDiscount}%)</span>
                  <span style={{ color: "hsl(177 98% 35%)" }}>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Total</span>
              <span className="text-xl font-black" style={{ color: "hsl(var(--foreground))" }}>₦{totalPrice.toLocaleString()}</span>
            </div>
            <button
              onClick={handleAddToOrders}
              disabled={!food.isOpen}
              className="flex-1 py-4 rounded-2xl text-base font-bold relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--vendoor-amber)) 100%)",
                color: "white",
                boxShadow: "0 8px 24px hsl(var(--primary) / 0.4)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Add to Cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;
