import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

interface Review {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
}

interface VendorReviewsProps {
  rating: number;
  reviewCount: string;
}

const mockReviews: Review[] = [
  { id: "r1", user: "Amina O.", rating: 5, text: "Best jollof rice in town! Packaging was excellent and food arrived hot. Will definitely order again.", date: "2 days ago" },
  { id: "r2", user: "Chidi K.", rating: 4, text: "Great food quality but delivery took a bit longer than expected. Taste was perfect though.", date: "5 days ago" },
  { id: "r3", user: "Fatima B.", rating: 5, text: "Absolutely love this place. Portion sizes are generous and everything tastes homemade.", date: "1 week ago" },
  { id: "r4", user: "David E.", rating: 3, text: "Food was okay, packaging could be better. Rice was slightly cold on arrival.", date: "2 weeks ago" },
  { id: "r5", user: "Blessing A.", rating: 5, text: "My go-to spot! Never disappoints. The pepper soup is amazing.", date: "3 weeks ago" },
];

const ratingBreakdown = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 8 },
  { stars: 2, pct: 4 },
  { stars: 1, pct: 2 },
];

const categoryRatings = [
  { label: "Food Quality", score: 4.7 },
  { label: "Packaging", score: 4.5 },
  { label: "Delivery", score: 4.3 },
];

const StarRow = ({ count, size = 12 }: { count: number; size?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={i < count ? "fill-vendoor-amber text-vendoor-amber" : "text-muted-foreground/30"}
        style={{ width: size, height: size }}
      />
    ))}
  </div>
);

const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 80;

  return (
    <div
      className="p-3.5 rounded-2xl bg-card border border-border animate-fade-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
            {review.user.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{review.user}</p>
            <p className="text-[10px] text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <StarRow count={review.rating} size={11} />
      </div>
      <p className={`text-xs text-muted-foreground leading-relaxed ${!expanded && isLong ? "line-clamp-2" : ""}`}>
        {review.text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-medium text-primary mt-1 flex items-center gap-0.5"
        >
          {expanded ? "Show less" : "Read more"}
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
};

const VendorReviews = ({ rating, reviewCount }: VendorReviewsProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? mockReviews : mockReviews.slice(0, 3);

  return (
    <div className="px-5 mt-5 animate-fade-in">
      <h2 className="text-base font-bold text-foreground mb-3">Ratings & Reviews</h2>

      {/* Summary block */}
      <div className="flex gap-4 p-4 rounded-2xl bg-card border border-border mb-3">
        {/* Left: big rating */}
        <div className="flex flex-col items-center justify-center pr-4 border-r border-border">
          <span className="text-3xl font-black text-foreground">{rating}</span>
          <StarRow count={Math.round(rating)} size={13} />
          <span className="text-[10px] text-muted-foreground mt-1">{reviewCount} reviews</span>
        </div>

        {/* Right: breakdown bars */}
        <div className="flex-1 space-y-1.5">
          {ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-muted-foreground w-3 text-right">{row.stars}</span>
              <Star className="w-2.5 h-2.5 fill-vendoor-amber text-vendoor-amber" />
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-vendoor-amber transition-all duration-500"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-7">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category ratings */}
      <div className="flex gap-2 mb-4">
        {categoryRatings.map((cat) => (
          <div key={cat.label} className="flex-1 p-2.5 rounded-xl bg-card border border-border text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">{cat.label}</p>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3 h-3 fill-vendoor-amber text-vendoor-amber" />
              <span className="text-sm font-bold text-foreground">{cat.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review list */}
      <div className="space-y-2.5">
        {visibleReviews.map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </div>

      {/* View all button */}
      {mockReviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2.5 rounded-xl border border-border text-sm font-semibold text-primary active:scale-[0.98] transition-transform"
        >
          {showAll ? "Show Less" : `View All ${mockReviews.length} Reviews`}
        </button>
      )}
    </div>
  );
};

export default VendorReviews;
