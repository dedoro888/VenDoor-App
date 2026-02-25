import { useState } from "react";
import { ArrowLeft, Package, Bike, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart, Order } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";

const stages = [
  { icon: Package, label: "Preparing", color: "text-vendoor-amber" },
  { icon: Bike, label: "Picked Up", color: "text-vendoor-orange" },
  { icon: CheckCircle2, label: "Delivered", color: "text-vendoor-green" },
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useCart();

  const canCancel = (order: Order) => {
    const elapsed = Date.now() - new Date(order.date).getTime();
    return elapsed < 5 * 60 * 1000; // 5 minutes
  };

  const isLateCancel = (order: Order) => {
    return !canCancel(order) && order.stage >= 2;
  };

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

            {/* Note */}
            {order.note && (
              <div className="px-3 py-2 rounded-xl bg-secondary text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> {order.note}
              </div>
            )}

            {/* Schedule */}
            {order.scheduledFor && (
              <div className="px-3 py-2 rounded-xl bg-vendoor-amber/10 text-xs text-vendoor-amber font-medium">
                📅 Scheduled: {new Date(order.scheduledFor).toLocaleString()}
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? "bg-primary/15" : "bg-secondary"
                        }`}>
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
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(order.stage / 3) * 100}%` }}
                  />
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
              <div>
                {canCancel(order) ? (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="w-full py-2 rounded-xl bg-vendoor-green/15 text-vendoor-green text-xs font-bold"
                  >
                    Cancel Order
                  </button>
                ) : isLateCancel(order) ? (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="w-full py-2 rounded-xl bg-destructive/15 text-destructive text-xs font-bold"
                  >
                    Late Cancellation
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="orders" />
    </div>
  );
};

export default OrdersPage;
