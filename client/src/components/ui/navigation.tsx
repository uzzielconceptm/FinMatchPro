import { useState, useEffect } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
  onSubscriptionClick?: () => void;
}

export function Navigation({ className, onSubscriptionClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass-effect card-shadow border-b border-gray-200/50"
          : "glass-effect border-b border-gray-200/30",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-gray-900 text-shadow-sm">FinMatch Service</div>
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-primary transition-all duration-200 font-medium hover:scale-105"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-600 hover:text-primary transition-all duration-200 font-medium hover:scale-105"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("plans")}
              className="text-gray-600 hover:text-primary transition-all duration-200 font-medium hover:scale-105"
            >
              How You Work
            </button>
            <Button 
              onClick={onSubscriptionClick}
              className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 card-shadow text-shadow-sm"
            >
              Get early access
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
