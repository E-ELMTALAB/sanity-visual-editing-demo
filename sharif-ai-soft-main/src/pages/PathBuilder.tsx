import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Target, 
  Code, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Rocket,
  Brain,
  Palette,
  Database,
  Globe,
  Bot,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PathBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    focus: "",
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const goals = [
    { id: "web-design", label: "طراحی و توسعه وب‌سایت", icon: Globe, color: "from-blue-500 to-cyan-500" },
    { id: "ai-ml", label: "هوش مصنوعی و یادگیری ماشین", icon: Brain, color: "from-purple-500 to-pink-500" },
    { id: "ui-ux", label: "طراحی UI/UX", icon: Palette, color: "from-orange-500 to-red-500" },
    { id: "backend", label: "توسعه بک‌اند", icon: Database, color: "from-green-500 to-emerald-500" },
  ];

  const focuses = [
    { id: "fullstack", label: "Full Stack (فرانت + بک)", icon: Code, desc: "تسلط کامل بر توسعه وب" },
    { id: "frontend", label: "فقط Frontend", icon: Palette, desc: "طراحی و توسعه رابط کاربری" },
    { id: "backend", label: "فقط Backend", icon: Database, desc: "توسعه سرور و دیتابیس" },
    { id: "ai-focused", label: "AI محور", icon: Bot, desc: "یادگیری عمیق هوش مصنوعی" },
  ];

  const recommendations = {
    "web-design-fullstack": {
      title: "مسیر توسعه Full Stack",
      courses: ["HTML & CSS پیشرفته", "JavaScript مدرن", "React.js", "Node.js & Express", "MongoDB"],
      duration: "6-8 ماه",
      description: "با این مسیر می‌تونی یک توسعه‌دهنده وب کامل بشی و پروژه‌های واقعی بسازی."
    },
    "web-design-frontend": {
      title: "مسیر توسعه Frontend",
      courses: ["HTML & CSS پیشرفته", "JavaScript ES6+", "React.js", "Tailwind CSS", "Next.js"],
      duration: "4-6 ماه",
      description: "تمرکز روی ساخت رابط‌های کاربری زیبا و تعاملی."
    },
    "ai-ml-ai-focused": {
      title: "مسیر هوش مصنوعی حرفه‌ای",
      courses: ["Python پایه", "Mathematics for AI", "Machine Learning", "Deep Learning", "NLP"],
      duration: "8-12 ماه",
      description: "از صفر تا متخصص هوش مصنوعی با پروژه‌های عملی."
    },
    "default": {
      title: "مسیر یادگیری شخصی‌سازی شده",
      courses: ["دوره مقدماتی", "دوره پیشرفته", "پروژه‌های عملی", "کارآموزی"],
      duration: "6 ماه",
      description: "یک مسیر یادگیری منحصر به فرد برای رسیدن به اهدافت."
    }
  };

  const getRecommendation = () => {
    const key = `${formData.goal}-${formData.focus}` as keyof typeof recommendations;
    return recommendations[key] || recommendations.default;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        return formData.goal !== "";
      case 3:
        return formData.focus !== "";
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              مسیر یادگیری شخصی شما
            </h1>
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">با چند سوال ساده، بهترین مسیر یادگیری رو برات پیدا می‌کنیم</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex justify-between mb-3">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50' 
                    : 'bg-background border-border text-muted-foreground'
                }`}>
                  {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                </div>
                <span className="text-xs text-muted-foreground">
                  {step === 1 && "مشخصات"}
                  {step === 2 && "هدف"}
                  {step === 3 && "تمرکز"}
                  {step === 4 && "نتیجه"}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Form Steps */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 md:p-12 backdrop-blur-xl bg-card/80 border-2 shadow-2xl shadow-primary/10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg shadow-primary/30">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">خوش اومدی! 👋</h2>
                    <p className="text-muted-foreground">اسمت رو بهمون بگو تا بهتر بشناسیمت</p>
                  </div>
                  <div className="space-y-4">
                    <Input
                      placeholder="اسم شما..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-lg h-14 text-center border-2 focus:border-primary transition-all"
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Goal Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 md:p-12 backdrop-blur-xl bg-card/80 border-2 shadow-2xl shadow-primary/10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent mb-4 shadow-lg shadow-secondary/30">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">سلام {formData.name}! 🎯</h2>
                    <p className="text-muted-foreground">می‌خوای چی یاد بگیری؟</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {goals.map((goal) => {
                      const Icon = goal.icon;
                      return (
                        <motion.div
                          key={goal.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            className={`p-4 md:p-6 cursor-pointer transition-all duration-300 border-2 flex flex-col items-center justify-center min-h-[140px] md:min-h-auto relative overflow-hidden group ${
                              formData.goal === goal.id
                                ? 'border-primary shadow-lg shadow-primary/30 bg-primary/5'
                                : 'border-border hover:shadow-lg'
                            }`}
                            onClick={() => setFormData({ ...formData, goal: goal.id })}
                          >
                            {/* Hover Border Effect */}
                            <div className={`absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${goal.color} -z-10`} style={{ padding: '2px' }}>
                              <div className="absolute inset-[2px] bg-card rounded-[inherit]" />
                            </div>
                            
                            {/* Background Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            
                            <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center mb-2 md:mb-4 shadow-md`}>
                              <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <h3 className="relative font-bold text-xs md:text-lg text-center">{goal.label}</h3>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Focus Selection */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 md:p-12 backdrop-blur-xl bg-card/80 border-2 shadow-2xl shadow-primary/10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary mb-4 shadow-lg shadow-accent/30">
                      <Code className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">عالیه! 🚀</h2>
                    <p className="text-muted-foreground">حالا بگو می‌خوای روی چی تمرکز کنی؟</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {focuses.map((focus) => {
                      const Icon = focus.icon;
                      return (
                        <motion.div
                          key={focus.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            className={`p-4 md:p-6 cursor-pointer transition-all duration-300 border-2 flex flex-col items-center justify-center min-h-[160px] md:min-h-[180px] ${
                              formData.focus === focus.id
                                ? 'border-primary shadow-lg shadow-primary/30 bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:shadow-lg'
                            }`}
                            onClick={() => setFormData({ ...formData, focus: focus.id })}
                          >
                            <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary mb-2 md:mb-3" />
                            <h3 className="font-bold text-xs md:text-lg mb-1 md:mb-2 text-center">{focus.label}</h3>
                            <p className="text-[10px] md:text-sm text-muted-foreground text-center">{focus.desc}</p>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 md:p-12 backdrop-blur-xl bg-card/80 border-2 shadow-2xl shadow-primary/10">
                  <div className="text-center mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4 shadow-2xl shadow-green-500/50"
                    >
                      <Rocket className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">تبریک {formData.name}! 🎉</h2>
                    <p className="text-muted-foreground">مسیر یادگیری شخصی‌سازی شده‌ت آماده است</p>
                  </div>

                  {(() => {
                    const rec = getRecommendation();
                    return (
                      <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
                          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            {rec.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">{rec.description}</p>
                          <div className="flex items-center gap-2 text-sm text-primary font-medium">
                            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                              مدت زمان: {rec.duration}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg mb-4">دوره‌های پیشنهادی:</h4>
                          <div className="space-y-3">
                            {rec.courses.map((course, index) => (
                              <motion.div
                                key={course}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-4 rounded-lg bg-secondary/5 border border-border hover:border-primary/50 transition-all"
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                                  {index + 1}
                                </div>
                                <span className="font-medium">{course}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
                          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                            سوال یا مشکلی داری؟
                          </h4>
                          <p className="text-muted-foreground mb-4">تیم پشتیبانی ما آماده کمک به شماست</p>
                          <a
                            href="https://t.me/support"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                          >
                            <MessageCircle className="w-5 h-5" />
                            ارتباط با پشتیبانی تلگرام
                          </a>
                        </div>

                        <Link to="/courses">
                          <Button className="w-full h-14 text-lg bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-xl hover:shadow-primary/50 transition-all">
                            شروع یادگیری
                            <ArrowRight className="w-5 h-5 mr-2" />
                          </Button>
                        </Link>
                      </div>
                    );
                  })()}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mt-8 gap-4"
            >
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="h-12 px-6"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                قبلی
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                بعدی
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathBuilder;