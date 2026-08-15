import React from "react";

export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const sizeStyles = {
    xs: "px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
    sm: "px-2.5 py-1 text-xs font-medium tracking-wide",
    md: "px-3 py-1.5 text-xs font-medium tracking-wide",
  };

  const variantStyles = {
    default: "bg-[#F0EDED] text-[#54433A] border border-[#DAC2B6]",
    terracotta: "bg-[#FFDBC9] text-[#6C2F00] border border-[#FFB68C]",
    forest: "bg-[#CDEACE] text-[#2E4632] border border-[#B2CEB3]",
    sand: "bg-[#FFDCBD] text-[#5B3912] border border-[#F0BD8B]",
    dark: "bg-[#1C1B1B] text-[#FCF9F8] border border-[#1C1B1B]",
    planned: "bg-[#FFDCBD] text-[#5B3912] border border-[#F0BD8B]",
    ongoing: "bg-[#CDEACE] text-[#2E4632] border border-[#B2CEB3]",
    completed: "bg-[#F0EDED] text-[#54433A] border border-[#DAC2B6]",
    outline: "bg-transparent text-[#54433A] border border-[#DAC2B6]",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full transition-colors ${sizeStyles[size] || sizeStyles.sm} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
