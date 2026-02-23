import { categories } from "@/data/mockData";

interface CategoryFilterProps {
  active: string;
  onSelect: (id: string) => void;
}

const CategoryFilter = ({ active, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 px-5 overflow-x-auto hide-scrollbar py-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            active === cat.id
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground"
          }`}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
