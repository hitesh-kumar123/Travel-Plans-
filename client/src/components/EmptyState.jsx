import React from "react";
import Button from "./Button";
import { Compass } from "lucide-react";

export const EmptyState = ({
  icon: Icon = Compass,
  title = "No items found",
  description = "Start your journey by creating or exploring new experiences.",
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-[#FFFFFF]/60 border border-dashed border-[#DAC2B6] rounded-md my-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-[#FFDBC9]/50 flex items-center justify-center text-[#6C2F00] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-[#1C1B1B] mb-2">
        {title}
      </h3>
      <p className="font-sans text-sm text-[#54433A] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="terracotta" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
