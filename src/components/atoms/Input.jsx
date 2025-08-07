import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error = false,
  label,
  ...props 
}, ref) => {
return (
    <div className={label ? "space-y-2" : ""}>
      {label && (
        <label className="block text-sm font-medium text-navy-700">
          {label}
        </label>
      )}
<input
        type={type}
        className={cn(
          "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 bg-white text-navy-900 placeholder-gray-500",
          "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          "min-h-[44px] touch-manipulation",
          "text-base font-medium appearance-none",
          error 
            ? "border-red-300 focus:border-red-500" 
            : "border-gray-200 hover:border-gray-300 focus:border-blue-500",
          type === "number" && "tabular-nums",
          type === "file" && "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;