import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium group",
          isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
            : "text-navy-600 hover:bg-gray-50 hover:text-navy-900",
          className
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            className={cn(
              "h-5 w-5 transition-colors",
              isActive ? "text-blue-600" : "text-navy-500 group-hover:text-navy-700"
            )} 
          />
          <span className="font-semibold">{children}</span>
        </>
      )}
    </NavLink>
  );
};

export default NavItem;