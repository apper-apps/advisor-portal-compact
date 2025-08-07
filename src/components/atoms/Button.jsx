import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl border-0",
    secondary: "bg-white hover:bg-gray-50 text-navy-900 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md",
    gold: "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg hover:shadow-xl border-0",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent",
    ghost: "bg-transparent hover:bg-gray-100 text-navy-700 border-0",
  };

const sizes = {
    sm: "px-3 py-2 text-sm font-medium min-h-[36px] sm:min-h-[32px]",
    default: "px-6 py-3 text-sm font-semibold min-h-[44px]",
    lg: "px-8 py-4 text-base font-semibold min-h-[48px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "transform hover:-translate-y-0.5 active:translate-y-0",
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;