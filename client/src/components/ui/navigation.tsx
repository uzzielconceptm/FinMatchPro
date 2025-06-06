import { useState, useEffect } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
// Removed logo import - using text-based branding

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
        "sticky top-0 z-50 transition-all duration-200",
        isScrolled
          ? "glass-effect card-shadow"
          : "glass-effect",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              FlowBooks Associate
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("plans")}
              className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
            >
              How You Work
            </button>
            <Button 
              onClick={onSubscriptionClick}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Get early access
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
