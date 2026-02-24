import { Play, Heart, MessageCircle, Share2, Music2 } from "lucide-react";
import { shops } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";

import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";
import food4 from "@/assets/food-4.jpg";
import food5 from "@/assets/food-5.jpg";
import food6 from "@/assets/food-6.jpg";

const videos = [
  { id: "v1", vendor: "Mama's Kitchen", caption: "Our famous Jollof rice is made with love 🍚❤️ #vendoor #jollof", thumbnail: food1, likes: "12.4k", comments: "843", isSponsored: true },
  { id: "v2", vendor: "Spice Junction", caption: "Fresh shawarma wraps every morning! Come grab yours 🌯", thumbnail: food6, likes: "8.1k", comments: "392", isSponsored: true },
  { id: "v3", vendor: "Lola's Cafe", caption: "Grilled fish perfection 🐟🔥 Only at Lola's", thumbnail: food3, likes: "5.7k", comments: "214", isSponsored: false },
  { id: "v4", vendor: "The Bahamas Hotel", caption: "Breakfast buffet is now open! 🥐☀️", thumbnail: food5, likes: "3.2k", comments: "156", isSponsored: true },
  { id: "v5", vendor: "Labrix Eateries", caption: "Pepper soup that warms the soul 🍲", thumbnail: food2, likes: "6.9k", comments: "501", isSponsored: false },
  { id: "v6", vendor: "Chip Chop Grill", caption: "Suya night is every night! 🥩🔥", thumbnail: food4, likes: "9.3k", comments: "678", isSponsored: true },
];

const DiscoverPage = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">Discover</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Trending from vendors near you</p>
      </div>

      <div className="px-4 space-y-4 pb-28">
        {videos.map((video) => (
          <div key={video.id} className="rounded-2xl overflow-hidden bg-card border border-border relative group">
            {/* Video thumbnail / fake player */}
            <div className="relative aspect-[9/12] bg-secondary">
              <img
                src={video.thumbnail}
                alt={video.caption}
                className="w-full h-full object-cover"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-background/30 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
                </div>
              </div>

              {/* Sponsored badge */}
              {video.isSponsored && (
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground">
                  Promoted
                </span>
              )}

              {/* Right-side actions */}
              <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
                <button className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-white drop-shadow">{video.likes}</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-white drop-shadow">{video.comments}</span>
                </button>
                <button className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-white drop-shadow">Share</span>
                </button>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/70 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{video.vendor[0]}</span>
                  </div>
                  <span className="text-sm font-bold text-white drop-shadow">{video.vendor}</span>
                </div>
                <p className="text-xs text-white/90 drop-shadow leading-relaxed">{video.caption}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Music2 className="w-3 h-3 text-white/70" />
                  <span className="text-[10px] text-white/70">Original sound – {video.vendor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="discover" />
    </div>
  );
};

export default DiscoverPage;
