import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-4 py-2.5 rounded-lg border-2 bg-white text-navy-900 placeholder-gray-500",
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        error 
          ? "border-red-300 focus:border-red-500" 
          : "border-gray-200 hover:border-gray-300 focus:border-blue-500",
        "text-base font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;