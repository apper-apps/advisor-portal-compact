import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle, clientName = "John Smith" }) => {
return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between min-h-[64px] px-4 sm:px-6 lg:px-8 py-2">
        {/* Mobile menu button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="min-w-[44px] min-h-[44px] p-2 touch-manipulation"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-navy-600 to-navy-800 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-navy-900">Trifecta</h1>
          </div>
        </div>

        {/* Desktop title */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-navy-900">Client Portal</h1>
        </div>

        {/* Client info */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-semibold text-navy-900">Welcome back,</p>
            <p className="text-sm sm:text-lg font-bold text-gold-600">{clientName}</p>
          </div>
          <div className="min-w-[44px] min-h-[44px] w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center touch-manipulation">
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