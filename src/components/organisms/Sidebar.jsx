import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Documents", href: "/documents", icon: "FileText" },
{ name: "Foundation", href: "/foundation", icon: "Building2" },
    { name: "Tax Planning", href: "/tax-planning", icon: "Calculator" },
    { name: "Wealth Building", href: "/wealth-building", icon: "TrendingUp" },
    { name: "Operations", href: "/operations", icon: "Building" },
    { name: "Educational Resources", href: "/educational-resources", icon: "BookOpen" },
  ];

  // Desktop Sidebar - Static positioning
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-800 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900">Trifecta</h2>
              <p className="text-xs text-navy-600 font-medium">Advisory Services</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} to={item.href} icon={item.icon}>
              {item.name}
            </NavItem>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar - Overlay with transforms
  const MobileSidebar = () => (
    <>
      {/* Mobile overlay */}
      <div className={cn("lg:hidden fixed inset-0 z-40", isOpen ? "block" : "hidden")}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
        >
          <div className="flex flex-col h-full pt-5 pb-4">
            <div className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-800 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-900">Trifecta</h2>
                  <p className="text-xs text-navy-600 font-medium">Advisory Services</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} to={item.href} icon={item.icon}>
                  {item.name}
                </NavItem>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;