import { useState } from "react";
import { Star, X, Send } from "lucide-react";
import { OrderRating } from "@/contexts/CartContext";

const VENDOR_TAGS = ["Food Quality", "Packaging", "Portion Size", "Taste", "Fresh"];
const RIDER_TAGS = ["Speed", "Professionalism", "Communication", "Friendly"];

interface RatingCardProps {
  orderId: string;
  vendorName: string;
  onSubmit: (orderId: string, rating: OrderRating) => void;
  onSkip: () => void;
}

const StarRow = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className="transition-transform active:scale-110"
      >
        <Star
          className="w-7 h-7 transition-colors"
          style={{
            fill: s <= value ? "hsl(var(--vendoor-amber))" : "transparent",
            color: s <= value ? "hsl(var(--vendoor-amber))" : "hsl(var(--muted-foreground))",
            strokeWidth: 1.5,
          }}
        />
      </button>
    ))}
  </div>
);

const TagSelector = ({ tags, selected, onToggle }: { tags: string[]; selected: string[]; onToggle: (t: string) => void }) => (
  <div className="flex flex-wrap gap-1.5">
    {tags.map((tag) => {
      const active = selected.includes(tag);
      return (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={active
            ? { background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.3)" }
            : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", border: "1px solid transparent" }
          }
        >
          {tag}
        </button>
      );
    })}
  </div>
);

const RatingCard = ({ orderId, vendorName, onSubmit, onSkip }: RatingCardProps) => {
  const [vendorStars, setVendorStars] = useState(0);
  const [riderStars, setRiderStars] = useState(0);
  const [vendorTags, setVendorTags] = useState<string[]>([]);
  const [riderTags, setRiderTags] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    setList(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  const handleSubmit = async () => {
    if (vendorStars === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(orderId, {
      vendorStars,
      vendorTags: vendorTags.length > 0 ? vendorTags : undefined,
      riderStars: riderStars || 0,
      riderTags: riderTags.length > 0 ? riderTags : undefined,
      review: review.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onSkip}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-card rounded-t-[28px] overflow-hidden shadow-2xl max-h-[85vh] flex flex-col slide-up-from-nav"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h3 className="text-lg font-bold" style={{ color: "hsl(var(--foreground))" }}>Rate Your Order</h3>
          <button onClick={onSkip} className="p-1.5 rounded-full" style={{ background: "hsl(var(--muted))" }}>
            <X className="w-4 h-4" style={{ color: "hsl(var(--foreground))" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
          {/* Vendor Rating */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: "hsl(var(--foreground))" }}>
              How was <span style={{ color: "hsl(var(--primary))" }}>{vendorName}</span>?
            </p>
            <StarRow value={vendorStars} onChange={setVendorStars} />
            {vendorStars > 0 && (
              <div className="mt-3">
                <p className="text-xs mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>What stood out?</p>
                <TagSelector tags={VENDOR_TAGS} selected={vendorTags} onToggle={(t) => toggleTag(vendorTags, setVendorTags, t)} />
              </div>
            )}
          </div>

          {/* Rider Rating */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: "hsl(var(--foreground))" }}>How was the rider?</p>
            <StarRow value={riderStars} onChange={setRiderStars} />
            {riderStars > 0 && (
              <div className="mt-3">
                <p className="text-xs mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Tags</p>
                <TagSelector tags={RIDER_TAGS} selected={riderTags} onToggle={(t) => toggleTag(riderTags, setRiderTags, t)} />
              </div>
            )}
          </div>

          {/* Review */}
          <div>
            <p className="text-xs mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Leave a review (optional)</p>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 120))}
              placeholder="Tell us about your experience..."
              className="w-full px-3 py-2.5 rounded-2xl text-sm resize-none h-16 outline-none"
              style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
            />
            <p className="text-[10px] text-right mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{review.length}/120</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 pt-3 flex gap-3 flex-shrink-0" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <button
            onClick={onSkip}
            className="px-6 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={vendorStars === 0 || submitting}
            className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))",
              color: "white",
            }}
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Send className="w-4 h-4" /> Submit</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
