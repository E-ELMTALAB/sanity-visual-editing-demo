import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface FilterState {
  categories: string[];
}

interface FiltersSidebarProps {
  onChange: (filters: FilterState) => void;
  className?: string;
}

interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "همه محصولات", count: 12 },
  { id: "ai", label: "هوش مصنوعی", count: 5 },
  { id: "social", label: "سوشیال مدیا", count: 3 },
  { id: "music", label: "موسیقی", count: 2 },
  { id: "education", label: "آموزشی", count: 8 },
  { id: "simcard", label: "سیمکارت", count: 1 },
];

interface FiltersSidebarProps {
  onChange: (filters: FilterState) => void;
  className?: string;
  categories?: CategoryOption[];
}

export function FiltersSidebar({
  onChange,
  className,
  categories = DEFAULT_CATEGORIES,
}: FiltersSidebarProps) {
  const { isRTL } = useDirection();
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    
    setSelectedCategories(newCategories);
    onChange({
      categories: newCategories,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    onChange({
      categories: [],
    });
  };

  const hasActiveFilters = selectedCategories.length > 0;

  const CollapsibleSection = ({
    title,
    isOpen,
    onToggle,
    children,
  }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <SurfaceGlass variant="default" className="overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          "w-full px-4 py-3 flex items-center justify-between",
          "text-sm font-semibold text-foreground",
          "hover:bg-surface-glass/50 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        )}
        aria-expanded={isOpen}
        aria-controls={`filter-section-${title}`}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`filter-section-${title}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springTransition}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </SurfaceGlass>
  );

  return (
    <aside
      className={cn(
        "w-full space-y-4 sticky top-[calc(84px+16px)]",
        className
      )}
      aria-label="Product filters"
    >
      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full justify-center gap-2"
          >
            <X className="h-3.5 w-3.5" />
            <span>پاک کردن فیلترها</span>
          </Button>
        </motion.div>
      )}

      {/* Categories */}
      <CollapsibleSection
        title="دسته‌بندی‌ها"
        isOpen={categoriesOpen}
        onToggle={() => setCategoriesOpen(!categoriesOpen)}
      >
        <fieldset className="space-y-3">
          <legend className="sr-only">دسته‌بندی محصولات</legend>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="flex-1 flex items-center justify-between text-sm cursor-pointer"
              >
                <span className="text-foreground">{category.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count ?? 0}
                </Badge>
              </Label>
            </div>
          ))}
        </fieldset>
      </CollapsibleSection>
    </aside>
  );
}
