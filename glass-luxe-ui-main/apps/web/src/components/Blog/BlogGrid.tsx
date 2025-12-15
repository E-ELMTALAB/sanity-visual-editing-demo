import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import { BlogCard, BlogPost } from "./BlogCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BlogGridProps {
  posts: BlogPost[];
  total?: number;
  shown?: number;
  loading?: boolean;
  error?: string;
  onLoadMore?: () => void;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BlogGrid({
  posts,
  total,
  shown,
  loading = false,
  error,
  onLoadMore,
  className,
}: BlogGridProps) {
  const { isRTL } = useDirection();

  const hasMore = total && shown ? shown < total : false;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <p className="text-destructive font-medium">
            {isRTL ? "خطا در بارگذاری مقالات" : "Error loading articles"}
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-lg">
          {isRTL ? "مقاله‌ای یافت نشد" : "No articles found"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10"
      >
        {posts.map((post) => (
          <motion.div key={post._id} variants={itemVariants}>
            <BlogCard post={post} />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className={cn(
              "min-w-[200px]",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            {isRTL ? "نمایش بیشتر" : "Load More"}
            {total && shown && (
              <span className={cn("text-xs text-muted-foreground", isRTL ? "mr-2" : "ml-2")}>
                ({shown} / {total})
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
