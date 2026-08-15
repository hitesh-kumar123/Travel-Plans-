import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded tracking-wider uppercase",
    md: "px-6 py-2.5 text-sm rounded tracking-wide",
    lg: "px-8 py-3.5 text-base rounded tracking-wide",
    pill: "px-6 py-2 text-sm rounded-full tracking-wide",
  };

  const variantStyles = {
    primary:
      "bg-[#1C1B1B] text-[#FCF9F8] border border-[#1C1B1B] hover:bg-[#333130] focus:ring-[#1C1B1B]",
    terracotta:
      "bg-[#6C2F00] text-[#FFFFFF] border border-[#6C2F00] hover:bg-[#8B4513] focus:ring-[#6C2F00]",
    forest:
      "bg-[#4B644E] text-[#FFFFFF] border border-[#4B644E] hover:bg-[#2E4632] focus:ring-[#4B644E]",
    outline:
      "bg-transparent text-[#1C1B1B] border border-[#DAC2B6] hover:border-[#1C1B1B] hover:bg-[#F6F3F2] focus:ring-[#DAC2B6]",
    outlineTerracotta:
      "bg-transparent text-[#6C2F00] border border-[#DAC2B6] hover:border-[#6C2F00] hover:bg-[#FFDBC9]/30 focus:ring-[#6C2F00]",
    ghost:
      "bg-transparent text-[#1C1B1B] hover:bg-[#F0EDED] border-transparent focus:ring-transparent",
    danger:
      "bg-[#BA1A1A] text-white border border-[#BA1A1A] hover:bg-[#93000A] focus:ring-[#BA1A1A]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
