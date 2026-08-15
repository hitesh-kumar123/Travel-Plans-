import React, { forwardRef } from "react";

export const FormField = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      value,
      onChange,
      placeholder,
      error,
      helperText,
      required = false,
      disabled = false,
      className = "",
      inputClassName = "",
      variant = "ghost",
      icon: Icon,
      rightElement,
      as = "input",
      rows = 3,
      ...props
    },
    ref,
  ) => {
    const Component = as;

    return (
      <div className={`w-full flex flex-col ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1.5"
          >
            {label}
            {required && <span className="text-[#BA1A1A] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-0 text-[#877369] pointer-events-none pr-2">
              <Icon className="w-4 h-4" />
            </div>
          )}

          {as === "textarea" ? (
            <textarea
              ref={ref}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={`w-full py-2.5 bg-transparent border-b transition-colors resize-y font-sans text-sm text-[#1C1B1B] placeholder-[#877369]/60 focus:outline-none ${
                error
                  ? "border-[#BA1A1A] focus:border-[#BA1A1A]"
                  : "border-[#DAC2B6] focus:border-[#6C2F00]"
              } ${Icon ? "pl-7" : ""} ${inputClassName}`}
              {...props}
            />
          ) : (
            <input
              ref={ref}
              id={name}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full py-2.5 bg-transparent border-b transition-colors font-sans text-sm text-[#1C1B1B] placeholder-[#877369]/60 focus:outline-none ${
                error
                  ? "border-[#BA1A1A] focus:border-[#BA1A1A]"
                  : "border-[#DAC2B6] focus:border-[#6C2F00]"
              } ${Icon ? "pl-7" : ""} ${rightElement ? "pr-10" : ""} ${inputClassName}`}
              {...props}
            />
          )}

          {rightElement && (
            <div className="absolute right-0 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1 text-xs text-[#BA1A1A] font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#877369]">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";
export default FormField;
