import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = React.forwardRef(({ 
  className, 
  placeholder = "Search...",
  value,
  onChange,
  onClear,
  ...props 
}, ref) => {
return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 sm:pl-11 pr-12 sm:pr-10 text-base sm:text-sm min-h-[44px] touch-manipulation"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px] touch-manipulation"
        >
          <ApperIcon name="X" className="h-5 w-5 text-gray-400" />
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;