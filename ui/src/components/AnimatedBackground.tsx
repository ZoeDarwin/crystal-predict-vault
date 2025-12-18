import React from "react";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "hero" | "section" | "footer";
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = "", variant = "section" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "hero":
        return "inset-0";
      case "section":
        return "inset-0";
      case "footer":
        return "inset-0";
      default:
        return "inset-0";
    }
  };

  return (
    <div className={`absolute ${getVariantClasses()} overflow-hidden pointer-events-none ${className}`}>
      {/* Primary blob */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-3xl animate-blob" />

      {/* Secondary blob */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />

      {/* Accent blob */}
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
    </div>
  );
};

export default AnimatedBackground;
