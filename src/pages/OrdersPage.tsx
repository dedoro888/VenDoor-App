import { useState, useEffect } from "react";
import { ArrowLeft, Package, Bike, CheckCircle2, X, Tag, Download, Eye, CreditCard, Clock, MapPin, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart, Order } from "@/contexts/CartContext";
import { foodItems } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";

const stages = [
  { icon: Package, label: "Confirmed", color: "text-vendoor-amber" },
  { icon: Bike, label: "On the Way", color: "text-vendoor-orange" },
  { icon: CheckCircle2, label: "Delivered", color: "text-vendoor-green" },
];

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

const ReceiptModal = ({ order, onClose }: ReceiptModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
    <div className="relative w-full max-w-sm bg-card rounded-3xl p-6 animate-in zoom-in-95 fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="text-center mb-5">
        <div className="w-14 h-14 rounded-full bg-vendoor-green/15 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-7 h-7 text-vendoor-green" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Payment Confirmed!</h3>
        <p className="text-sm text-muted-foreground mt-1">Your order is being prepared</p>
      </div>
      <div className="bg-secondary rounded-2xl p-4 space-y-2 text-sm mb-5">
        <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-bold text-foreground">{order.id}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span className="font-medium text-foreground">{order.vendorName}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span className="font-medium text-foreground">{order.items.length} item(s)</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-medium text-foreground capitalize">{order.deliveryType}</span></div>
        {order.promoCode && (
          <div className="flex justify-between"><span className="text-muted-foreground">Promo</span><span className="font-medium text-vendoor-green">{order.promoCode} (-{order.promoDiscount}%)</span></div>
        )}
        <div className="flex justify-between border-t border-border pt-2 mt-2">
          <span className="font-bold text-foreground">Total Paid</span>
          <span className="font-bold text-primary text-base">₦{order.total.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-secondary text-sm font-bold text-foreground flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" /> View Orders
        </button>
        <button
          onClick={() => { alert("Receipt downloaded!"); onClose(); }}
          className="flex-1 py-3 rounded-2xl text-sm font-bold text-primary-foreground flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
        >
          <Download className="w-4 h-4" /> Download
        </button>
      </div>
    </div>
  </div>
);

interface CheckoutModalProps {
  order: Order;
  onClose: () => void;
  onPay: (orderId: string) => void;
}

const CheckoutModal = ({ order, onClose, onPay }: CheckoutModalProps) => {
  const [paying, setPaying] = useState(false);
  const handlePaystack = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    onPay(order.id);
    setPaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card rounded-t-3xl p-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-foreground mb-4">Confirm & Pay</h3>
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.food.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{item.quantity}x {item.food.name}</span>
              <span className="font-medium text-foreground">₦{(item.food.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          {order.promoCode && (
            <div className="flex items-center justify-between text-sm border-t border-border pt-2">
              <span className="text-vendoor-green">Promo ({order.promoCode})</span>
              <span className="font-medium text-vendoor-green">-{order.promoDiscount}%</span>
            </div>
          )}
          <div className="flex items-center justify-between text-base font-bold border-t border-border pt-2">
            <span className="text-foreground">Total</span>
            <span className="text-primary">₦{order.total.toLocaleString()}</span>
          </div>
        </div>
        {order.scheduledFor && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-vendoor-amber/10 text-xs text-vendoor-amber font-medium mb-3">
            <Clock className="w-3.5 h-3.5" /> Scheduled: {new Date(order.scheduledFor).toLocaleString()}
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-xs text-muted-foreground mb-4">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="capitalize">{order.deliveryType} • {order.vendorName}</span>
        </div>
        <button
          onClick={handlePaystack}
          disabled={paying}
          className="w-full py-4 rounded-2xl text-base font-bold text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
        >
          <CreditCard className="w-5 h-5" />
          {paying ? "Processing..." : `Pay ₦${order.total.toLocaleString()} via Paystack`}
        </button>
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  canCancel: (o: Order) => boolean;
  isLateCancel: (o: Order) => boolean;
  onCancel: (id: string) => void;
  onReorder: (o: Order) => void;
  isPast?: boolean;
}

const OrderCard = ({ order, canCancel, isLateCancel, onCancel, onReorder, isPast }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      {/* Tap header to expand */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0 mr-2">
          <p className="text-sm font-bold text-foreground">{order.id}</p>
          <p className="text-xs text-muted-foreground">{order.vendorName} • {new Date(order.date).toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">{order.deliveryType}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-bold text-primary">₦{order.total.toLocaleString()}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {/* Items */}
          <div className="space-y-1.5">
            {order.items.map((item) => (
              <div key={item.food.id} className="flex items-center justify-between text-xs">
                <span className="text-foreground">{item.quantity}x {item.food.name}</span>
                <span className="font-medium text-foreground">₦{(item.food.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="capitalize font-medium text-foreground">{order.deliveryType}</span>
            {order.scheduledFor && (
              <><span>•</span><Clock className="w-3.5 h-3.5" /><span>{new Date(order.scheduledFor).toLocaleString()}</span></>
            )}
          </div>

          {/* Promo */}
          {order.promoCode && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vendoor-green/10 text-xs text-vendoor-green font-medium">
              <Tag className="w-3.5 h-3.5" /> {order.promoCode} — {order.promoDiscount}% off
            </div>
          )}

          {/* Special Instructions */}
          {order.note && (
            <div className="px-3 py-2 rounded-xl bg-secondary text-xs text-muted-foreground">
              <span className="font-medium text-foreground">📝 Special Instructions:</span> {order.note}
            </div>
          )}

          {/* 3-Stage Tracker */}
          {!order.cancelled && (
            <>
              <div className="flex items-center gap-1">
                {stages.map((stage, i) => {
                  const StageIcon = stage.icon;
                  const isActive = order.stage >= i + 1;
                  const isCurrent = order.stage === i + 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-primary/15" : "bg-secondary"}`}>
                        <StageIcon className={`w-4 h-4 ${isActive ? stage.color : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-[10px] font-medium text-center ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${(order.stage / 3) * 100}%` }} />
              </div>
            </>
          )}

          {order.cancelled && (
            <div className="px-3 py-2 rounded-xl bg-destructive/10 text-xs text-destructive font-medium flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Order Cancelled
            </div>
          )}

          {/* Cancel buttons */}
          {!order.cancelled && order.stage < 3 && (
            canCancel(order) ? (
              <button onClick={() => onCancel(order.id)} className="w-full py-2 rounded-xl bg-vendoor-green/15 text-vendoor-green text-xs font-bold">
                Cancel Order (Free)
              </button>
            ) : isLateCancel(order) ? (
              <button onClick={() => onCancel(order.id)} className="w-full py-2 rounded-xl bg-destructive/15 text-destructive text-xs font-bold">
                Late Cancellation
              </button>
            ) : null
          )}

          {/* Reorder on past successful orders */}
          {isPast && order.stage === 3 && !order.cancelled && (
            <button
              onClick={() => onReorder(order)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-primary-foreground flex items-center justify-center gap-1.5"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reorder
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orders, cancelOrder, confirmPayment, placeOrder, items, cartTotal, addToCart } = useCart();
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<"current" | "past">(
    searchParams.get("tab") === "past" ? "past" : "current"
  );

  useEffect(() => {
    if (searchParams.get("tab") === "past") setActiveTab("past");
  }, [searchParams]);

  const canCancel = (order: Order) => {
    const elapsed = Date.now() - new Date(order.date).getTime();
    return elapsed < 5 * 60 * 1000;
  };
  const isLateCancel = (order: Order) => !canCancel(order) && order.stage >= 2;

  const handlePay = (orderId: string) => {
    confirmPayment(orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order) setReceiptOrder({ ...order, paymentStatus: "paid" });
    setCheckoutOrder(null);
  };

  const handleCheckout = () => {
    const order = placeOrder();
    setCheckoutOrder(order);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const food = foodItems.find((f) => f.id === item.food.id);
      if (food) addToCart(food, item.quantity, item.deliveryType, item.note, undefined, item.promoCode, item.promoDiscount);
    });
    navigate("/orders");
    setActiveTab("current");
  };

  const currentOrders = orders.filter((o) => !o.cancelled && o.stage < 3 && o.paymentStatus === "paid");
  const pastOrders = orders.filter((o) => o.cancelled || o.stage === 3);
  const pendingOrders = orders.filter((o) => o.paymentStatus === "pending" && !o.cancelled);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <button onClick={() => navigate("/")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
      </div>

      {/* Cart items to checkout */}
      {items.length > 0 && (
        <div className="mx-5 mb-4 p-4 rounded-2xl bg-card border border-border">
          <p className="text-sm font-bold text-foreground mb-3">Items ready to order ({items.length})</p>
          {items.map((item) => (
            <div key={item.food.id} className="flex justify-between text-sm mb-1">
              <span className="text-foreground">{item.quantity}x {item.food.name}</span>
              <span className="font-medium text-foreground">₦{(item.food.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-border mt-2 pt-2 flex justify-between items-center">
            <span className="font-bold text-foreground">Total: ₦{cartTotal.toLocaleString()}</span>
            <button
              onClick={handleCheckout}
              className="px-4 py-2 rounded-xl text-sm font-bold text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Pending payment orders */}
      {pendingOrders.map((order) => (
        <div key={order.id} className="mx-5 mb-3 p-4 rounded-2xl bg-vendoor-amber/10 border border-vendoor-amber/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-foreground">{order.id}</p>
              <p className="text-xs text-muted-foreground">Pending Payment</p>
            </div>
            <button
              onClick={() => setCheckoutOrder(order)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
            >
              Pay Now
            </button>
          </div>
        </div>
      ))}

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {(["current", "past"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >
            {tab === "current" ? `Current${currentOrders.length > 0 ? ` (${currentOrders.length})` : ""}` : "History"}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-3 pb-28">
        {activeTab === "current" && currentOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No active orders</p>
          </div>
        )}
        {activeTab === "past" && pastOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No past orders yet</p>
          </div>
        )}

        {(activeTab === "current" ? currentOrders : pastOrders).map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            canCancel={canCancel}
            isLateCancel={isLateCancel}
            onCancel={cancelOrder}
            onReorder={handleReorder}
            isPast={activeTab === "past"}
          />
        ))}
      </div>

      {checkoutOrder && <CheckoutModal order={checkoutOrder} onClose={() => setCheckoutOrder(null)} onPay={handlePay} />}
      {receiptOrder && <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />}

      <BottomNav active="orders" />
    </div>
  );
};

export default OrdersPage;
