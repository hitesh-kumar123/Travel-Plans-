import React from "react";
import Button from "./Button";
import { AlertCircle } from "lucide-react";

export const ErrorState = ({
  title = "Something went wrong",
  message = "We encountered an error while fetching your details.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-[#FFDAD6]/30 border border-[#BA1A1A]/30 rounded-md my-6 ${className}`}
    >
      <AlertCircle className="w-10 h-10 text-[#BA1A1A] mb-3" />
      <h3 className="font-serif text-xl font-bold text-[#BA1A1A] mb-1">
        {title}
      </h3>
      <p className="font-sans text-sm text-[#54433A] max-w-md mb-5">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
