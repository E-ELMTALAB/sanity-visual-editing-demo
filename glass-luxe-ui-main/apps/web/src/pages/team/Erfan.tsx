import { motion, Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Linkedin, Github, Globe, Award, Code2, Briefcase } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Helmet } from "@/components/Helmet";

const Erfan = () => {
  const springTransition: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 20
  };

  const skills = [
    "React & TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "UI/UX Design",
    "Performance Optimization",
    "Responsive Design",
    "Component Architecture",
    "Design Systems"
  ];

  const achievements = [
    {
      icon: Code2,
      title: "Frontend Architecture",
      description: "Built the entire SharifGPT frontend with Arctic-Dawn glass design system"
    },
    {
      icon: Award,
      title: "Performance Expert",
      description: "Optimized site loading time by 60% through code splitting and lazy loading"
    },
    {
      icon: Briefcase,
      title: "Component Library",
      description: "Created 50+ reusable glassmorphism components with RTL support"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Erfan - Frontend Developer | SharifGPT</title>
        <meta name="description" content="Erfan is the Frontend Developer and Site Builder at SharifGPT, specializing in React, TypeScript, and modern web design." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#0A1A2F] via-[#162236] to-[#1A1F3A] text-white">
        <Header onSearch={() => {}} />

        <main className="mx-auto max-w-[1100px] px-4 md:px-6 lg:px-8 py-12 md:py-16">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springTransition}
            className="mb-8"
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              بازگشت به تیم
            </Link>
          </motion.div>

          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
            className="glass rounded-3xl p-8 md:p-12 border border-white/30 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-2 ring-white/30 shadow-[0_0_40px_rgba(10,132,255,0.3)]">
                <AvatarImage src="/static/team/erfan.jpg" alt="Erfan" />
                <AvatarFallback className="bg-gradient-to-br from-[#0A84FF] to-[#FF5AC8] text-white font-bold text-4xl">
                  E
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-right">
                <h1 className="text-[32px] md:text-[44px] font-bold bg-gradient-to-r from-[#0A84FF] to-[#FF5AC8] bg-clip-text text-transparent mb-2">
                  Erfan
                </h1>
                <p className="text-[18px] md:text-[20px] text-white/80 mb-4">
                  Frontend Developer / Site Builder
                </p>
                <p className="text-white/70 leading-8 max-w-[600px] mx-auto md:mx-0">
                  طراح و توسعه‌دهنده رابط کاربری شریف‌GPT با تمرکز بر طراحی Arctic-Dawn و تجربه کاربری بی‌نقص. متخصص در React، TypeScript و سیستم‌های طراحی مدرن.
                </p>

                {/* Social Links */}
                <div className="flex justify-center md:justify-start gap-3 mt-6">
                  <a
                    href="mailto:erfan@sharifgpt.com"
                    className="glass p-3 rounded-xl hover:bg-white/10 transition-all border border-white/20 hover:border-white/40"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="glass p-3 rounded-xl hover:bg-white/10 transition-all border border-white/20 hover:border-white/40"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="glass p-3 rounded-xl hover:bg-white/10 transition-all border border-white/20 hover:border-white/40"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="glass p-3 rounded-xl hover:bg-white/10 transition-all border border-white/20 hover:border-white/40"
                    aria-label="Portfolio"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Skills Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-[24px] md:text-[28px] font-bold mb-6">تخصص‌ها</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, idx) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...springTransition, delay: 0.1 + idx * 0.05 }}
                >
                  <Badge className="glass px-4 py-2 text-[15px] border border-white/30 bg-white/5 hover:bg-white/10 transition-all">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Achievements Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 }}
          >
            <h2 className="text-[24px] md:text-[28px] font-bold mb-6">دستاوردها</h2>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {achievements.map((achievement, idx) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springTransition, delay: 0.2 + idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="glass rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0A84FF]/20 to-[#FF5AC8]/20 flex items-center justify-center mb-4 ring-1 ring-white/20">
                      <Icon className="h-6 w-6 text-[#0A84FF]" />
                    </div>
                    <h3 className="text-[18px] font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-white/70 leading-7">{achievement.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Aurora Effect */}
          <div
            className="pointer-events-none fixed inset-x-0 -z-10 top-0 h-[50vh] blur-3xl opacity-60"
            style={{
              background: `
                radial-gradient(40% 35% at 45% 25%, rgba(10,132,255,0.4), transparent 70%),
                radial-gradient(35% 40% at 55% 60%, rgba(160,90,255,0.35), transparent 72%)
              `
            }}
          />
        </main>

        <Footer 
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support"
          }}
          socials={[
            { type: "Telegram", href: "https://t.me/sharifgpt" },
            { type: "Instagram", href: "https://instagram.com/sharifgpt" }
          ]}
        />
      </div>
    </>
  );
};

export default Erfan;
