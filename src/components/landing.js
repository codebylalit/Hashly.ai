import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Image,
  Hash,
  Zap,
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  Wand2,
  Brain,
  SparklesIcon,
} from "lucide-react";
import logo from "../logo.png";
import { IoMdHeart } from "react-icons/io";

// Decorative background elements
const BackgroundElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Floating hashtags */}
    <div className="absolute top-1/4 left-1/4 animate-float-slow text-accent-teal/10">
      <Hash className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
    </div>
    <div className="absolute top-1/3 right-1/4 animate-float text-accent-orange/10">
      <Hash className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
    </div>
    <div className="absolute bottom-1/4 left-1/3 animate-float-slow text-accent-teal/10">
      <Hash className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
    </div>

    {/* Sparkles */}
    <div className="absolute top-1/2 right-1/3 animate-pulse text-accent-orange/10">
      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
    </div>
    <div className="absolute bottom-1/3 left-1/4 animate-pulse-slow text-accent-teal/10">
      <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
    </div>

    {/* Brain icon */}
    <div className="absolute top-2/3 right-1/4 animate-float text-accent-orange/10">
      <Brain className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
    </div>
  </div>
);

const keyFeatures = [
  {
    icon: <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
    title: "AI Magic",
    description:
      "Transform your ideas into engaging content with our advanced AI technology.",
  },
  {
    icon: <Brain className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14" />,
    title: "Smart Analysis",
    description:
      "Intelligent content analysis for perfect captions and trending hashtags.",
  },
  {
    icon: <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
    title: "Style Variety",
    description:
      "Choose from multiple content styles to match your brand voice.",
  },
];

const creativeSection = [
  {
    title: "Create",
    description: "Generate unique captions and hashtags in seconds",
    color: "from-accent-teal/20 to-accent-teal/5",
  },
  {
    title: "Customize",
    description: "Fine-tune your content to match your style",
    color: "from-accent-orange/20 to-accent-orange/5",
  },
  {
    title: "Share",
    description: "Export and share your content instantly",
    color: "from-accent-teal/20 to-accent-teal/5",
  },
];

const headings = [
  "Turn Your Posts into Magic",
  "Let's Make Your Posts Shine",
  "Captions & Hashtags Made Simple",
];

const Landing = () => {
  const navigate = useNavigate();
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentHeading = headings[currentHeadingIndex];

    if (!isDeleting && displayText === currentHeading) {
      // Pause at the end of typing
      setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(50); // Faster deletion
      }, 2000);
      return;
    }

    if (isDeleting && displayText === "") {
      // Move to next heading after deletion
      setIsDeleting(false);
      setCurrentHeadingIndex((prevIndex) => (prevIndex + 1) % headings.length);
      setTypingSpeed(100); // Normal typing speed
      return;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentHeading.slice(0, displayText.length + 1));
      } else {
        setDisplayText(currentHeading.slice(0, displayText.length - 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, currentHeadingIndex, isDeleting, typingSpeed]);

  return (
    <div className="min-h-screen bg-background-main flex flex-col font-poppins">
      <BackgroundElements />
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-background-main to-background-card/60 border-b border-border-light">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-teal/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-14 sm:px-82 md:px-60 relative z-10 py-8 sm:py-12 md:py-18">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-main mb-6 sm:mb-8 md:mb-10 leading-tight min-h-[1.2em]">
            <span className="inline-block">
              {displayText}
              <span className="inline-block w-1 h-10 sm:h-12 md:h-14 bg-accent-teal animate-blink ml-1"></span>
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-10 sm:mb-14 md:mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
            Your AI-powered companion for crafting engaging social media
            content. Generate captions and hashtags that connect with your
            audience.
          </p>
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 bg-accent-teal/10 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent-teal" />
              <span className="text-xs sm:text-sm md:text-base font-semibold text-accent-teal">
                AI-Powered
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 bg-accent-orange/10 rounded-full shadow-sm">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent-orange" />
              <span className="text-xs sm:text-sm md:text-base font-semibold text-accent-orange">
                Trending Hashtags
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 bg-accent-teal/10 rounded-full shadow-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent-teal" />
              <span className="text-xs sm:text-sm md:text-base font-semibold text-accent-teal">
                Lightning Fast
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-md mx-auto">
            <button
              className="group w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-accent-teal text-text-light rounded-full text-sm sm:text-base md:text-lg font-bold hover:bg-accent-orange transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-teal"
              onClick={() => navigate("/try")}
            >
              Try Free
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://play.google.com/store/apps/details?id=your.app.id"
              className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-background-card text-primary-main rounded-full text-sm sm:text-base md:text-lg font-bold hover:bg-accent-teal transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent-teal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download App
            </a>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 sm:py-32 md:py-40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-orange/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-16 sm:px-32 md:px-60 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-accent-orange/10 text-accent-orange text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6">
              Powerful Features
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-main">
              Key Features
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 sm:p-8 md:p-10 rounded-2xl bg-background-card hover:shadow-xl transition-all duration-300 border border-border-light hover:border-accent-teal/30 hover:-translate-y-1"
              >
                <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 flex items-center justify-center mb-6 text-accent-teal mx-auto bg-gradient-to-br from-accent-teal/10 to-transparent rounded-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-main mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Process Section */}
      <section className="py-20 sm:py-32 md:py-40 bg-background-card relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-teal/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-16 sm:px-32 md:px-60 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-accent-teal/10 text-accent-teal text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6">
              How It Works
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-main">
              Simple Creative Process
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {creativeSection.map((step, index) => (
              <div
                key={index}
                className={`relative p-6 sm:p-8 md:p-10 rounded-2xl bg-gradient-to-br ${step.color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="absolute -top-4 -left-4 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center bg-gradient-to-br from-accent-teal to-accent-orange text-text-light rounded-full font-bold shadow-lg text-sm sm:text-base md:text-lg">
                  {index + 1}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-main mb-4">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 md:py-40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-teal/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-16 sm:px-32 md:px-60 text-center relative z-10">
          <div className="inline-block px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-accent-teal/10 text-accent-teal text-sm sm:text-base md:text-lg font-medium mb-4 sm:mb-6">
            Get Started
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-main mb-6 sm:mb-8">
            Ready to Create Amazing Content?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
            Join creators who trust Hashly for their social media success.
          </p>
          <button
            className="group w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-accent-teal text-text-light rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-accent-orange transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
            onClick={() => navigate("/try")}
          >
            Start Creating Now
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border-light">
        <div className="max-w-7xl mx-auto px-16 sm:px-32 md:px-60">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center text-sm text-text-secondary gap-1">
              <span>Built with</span>
              <IoMdHeart className="w-4 h-4 text-teal-500" aria-label="heart" />
              <span>for creators</span>
            </div>
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/about"
                className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
              >
                About Us
              </a>
            </div>
            <p className="text-sm text-text-secondary">
              © {new Date().getFullYear()} Hashly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
