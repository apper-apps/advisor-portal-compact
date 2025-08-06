import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle, clientName = "John Smith" }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex items-center gap-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="p-2"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-navy-600 to-navy-800 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-navy-900">Trifecta</h1>
          </div>
        </div>

        {/* Desktop title */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-navy-900">Client Portal</h1>
        </div>

        {/* Client info */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-navy-900">Welcome back,</p>
            <p className="text-lg font-bold text-gold-600">{clientName}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {clientName.split(" ").map(n => n[0]).join("").toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;