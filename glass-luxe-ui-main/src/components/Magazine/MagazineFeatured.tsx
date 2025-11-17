import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { MagazineCard } from "./MagazineCard";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface MagazinePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
  image: string;
}

interface MagazineFeaturedProps {
  posts: MagazinePost[];
  onRead: (slug: string) => void;
  onViewMagazine?: () => void;
  className?: string;
}

export function MagazineFeatured({ posts, onRead, onViewMagazine, className }: MagazineFeaturedProps) {
  return (
    <section className={cn("relative py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] overflow-hidden bg-transparent", className)}>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader
          title="مطالب ویژه"
          eyebrow="مجله شریف جی‌پی‌تی"
          className="mb-6"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10"
        >
          {posts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: index * 0.1 }}
            >
              <MagazineCard
                id={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                readTime={post.readTime}
                image={post.image}
                onRead={onRead}
              />
            </motion.div>
          ))}
        </motion.div>

        {onViewMagazine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={onViewMagazine}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-21.33px)] px-8 py-4 rounded-2xl glass border border-white/20 backdrop-blur-xl font-semibold text-foreground hover:border-primary/50 transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)]"
            >
              مشاهده مجله
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
