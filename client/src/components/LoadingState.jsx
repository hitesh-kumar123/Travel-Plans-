import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingState = ({
  message = "Loading experience...",
  fullPage = false,
}) => {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#6C2F00] animate-spin mb-4" />
        <p className="font-serif text-lg text-[#54433A] italic">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-6 h-6 text-[#6C2F00] animate-spin mr-3" />
      <span className="font-serif text-sm text-[#54433A] italic">
        {message}
      </span>
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#FFFFFF] border border-[#E5E2E1] rounded overflow-hidden animate-pulse"
        >
          <div className="h-64 bg-[#F0EDED]" />
          <div className="p-6 space-y-3">
            <div className="h-4 bg-[#F0EDED] w-1/3 rounded" />
            <div className="h-6 bg-[#F0EDED] w-3/4 rounded" />
            <div className="h-4 bg-[#F0EDED] w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
