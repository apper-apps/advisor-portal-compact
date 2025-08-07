import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const TrifectaOverview = () => {
  const pillars = [
    {
      name: "Foundation",
      description: "Tax optimization strategies and compliance management to minimize your tax burden legally and effectively.",
      icon: "Shield",
      status: "Active",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      features: ["Tax Planning", "Compliance Review", "Deduction Optimization"]
    },
    {
      name: "Operations",
      description: "Asset protection and business structure optimization to safeguard your wealth from potential risks.",
      icon: "Settings",
      status: "In Progress",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      features: ["Business Structure", "Asset Protection", "Risk Management"]
    },
    {
      name: "Holdings",
      description: "Wealth building through strategic investments and portfolio management for long-term growth.",
      icon: "TrendingUp",
      status: "Planning",
      color: "from-gold-500 to-gold-600",
      bgColor: "from-gold-50 to-gold-100",
      features: ["Investment Strategy", "Portfolio Management", "Growth Planning"]
    }
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "In Progress":
        return "info";
      case "Planning":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-navy-900"
        >
          The Trifecta System
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Our comprehensive three-pillar approach to financial optimization combines tax savings, 
          asset protection, and wealth building to secure your financial future.
        </motion.p>
      </div>

{/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full p-6 hover:shadow-lg transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.bgColor} flex items-center justify-center mb-6`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center`}>
                  <ApperIcon name={pillar.icon} className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-navy-900">{pillar.name}</h3>
                  <Badge variant={getStatusVariant(pillar.status)} size="sm">
                    {pillar.status}
                  </Badge>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-navy-700">Key Areas:</h4>
                  <ul className="space-y-1">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Check" className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Connection Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center p-8 bg-gradient-to-r from-navy-50 to-blue-50 rounded-2xl"
      >
        <div className="inline-flex items-center gap-4 text-navy-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">1</span>
          </div>
          <ApperIcon name="ArrowRight" className="h-5 w-5" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          <ApperIcon name="ArrowRight" className="h-5 w-5" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">3</span>
          </div>
        </div>
        <p className="mt-4 text-navy-600 font-medium">
          Each pillar builds upon the previous, creating a comprehensive financial optimization strategy
        </p>
      </motion.div>
    </div>
  );
};

export default TrifectaOverview;