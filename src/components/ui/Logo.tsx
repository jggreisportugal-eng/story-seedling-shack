import { BookOpen } from "lucide-react";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const Logo = ({ variant = "dark", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32,
  };

  return (
    <div
      className={`flex items-center gap-2 font-display font-semibold ${sizeClasses[size]} ${
        variant === "light" ? "text-primary-foreground" : "text-primary"
      }`}
    >
      <BookOpen size={iconSizes[size]} className="text-amber" />
      <span>Contos Diários</span>
    </div>
  );
};

export default Logo;
