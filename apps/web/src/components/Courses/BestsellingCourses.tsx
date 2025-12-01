import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface Course {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  rating: number;
  hours: number;
  image: string;
  price: number;
}

interface BestsellingCoursesProps {
  courses: Course[];
  onAdd: (id: string) => void;
  onView?: (id: string) => void;
  onViewAll?: () => void;
  className?: string;
}

export function BestsellingCourses({ courses, onAdd, onView, onViewAll, className }: BestsellingCoursesProps) {
  return (
    <section className={cn("relative py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] overflow-hidden bg-transparent", className)}>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader
          title="دوره‌های برتر"
          eyebrow="پرفروش‌ترین دوره‌های آموزشی"
          className="mb-6"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10"
        >
          {courses.slice(0, 6).map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: index * 0.05 }}
            >
              <CourseCard
                id={course.id}
                title={course.title}
                instructor={course.instructor}
                rating={course.rating}
                hours={course.hours}
                image={course.image}
                price={course.price}
                onAdd={onAdd}
                onView={onView}
              />
            </motion.div>
          ))}
        </motion.div>

        {onViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <Button
              onClick={onViewAll}
              variant="viewAll"
              size="lg"
              className="w-full sm:w-auto rounded-2xl"
            >
              مشاهده همه
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
