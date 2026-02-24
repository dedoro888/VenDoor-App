import { ArrowLeft, Package, Bike, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";

const stages = [
  { icon: Package, label: "Cooked & Packed", color: "text-vendoor-amber" },
  { icon: Bike, label: "Rider Pickup", color: "text-vendoor-orange" },
  { icon: CheckCircle2, label: "Received", color: "text-vendoor-green" },
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useCart();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <button onClick={() => navigate("/")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
      </div>

      <div className="px-5 space-y-4 pb-28">
        {orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl bg-card border border-border p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-foreground">{order.id}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <span className="text-sm font-bold text-primary">₦{order.total.toLocaleString()}</span>
            </div>

            {/* Items */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {order.items.map((item) => (
                <div key={item.food.id} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground">
                  {item.quantity}x {item.food.name}
                </div>
              ))}
            </div>

            {/* 3-Stage Tracker */}
            <div className="flex items-center gap-1">
              {stages.map((stage, i) => {
                const StageIcon = stage.icon;
                const isActive = order.stage >= i + 1;
                const isCurrent = order.stage === i + 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? "bg-primary/15" : "bg-secondary"
                    }`}>
                      <StageIcon className={`w-4 h-4 ${isActive ? stage.color : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-[10px] font-medium text-center ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {stage.label}
                    </span>
                    {i < 2 && (
                      <div className={`absolute h-0.5 w-8 ${isActive ? "bg-primary" : "bg-border"}`} style={{ display: "none" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(order.stage / 3) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="orders" />
    </div>
  );
};

export default OrdersPage;
