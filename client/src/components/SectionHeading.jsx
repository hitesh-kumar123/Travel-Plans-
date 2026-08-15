import React from "react";

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
  titleClassName = "",
}) => {
  const alignClass = {
    left: "text-left",
    center: "text-center mx-auto items-center",
    right: "text-right items-end",
  }[align];

  return (
    <div className={`flex flex-col mb-8 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6C2F00] mb-2 inline-block">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1B1B] font-bold leading-tight ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-[#54433A] max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
