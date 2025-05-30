import { useState, useEffect } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
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
          ? "bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm"
          : "bg-white/90 backdrop-blur-sm border-b border-gray-100",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl text-gray-900">FinMatch Software</div>
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              How it works
            </button>
            <Button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105">
              Start tracking now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
