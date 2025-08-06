import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const TaxPlanning = () => {
  const taxStrategies = [
    {
      title: "Business Structure Optimization",
      description: "Maximize deductions through strategic business entity selection and structure optimization",
      status: "Active",
      savings: "$15,200",
      complexity: "Medium",
      icon: "Building"
    },
    {
      title: "Retirement Planning",
      description: "Tax-advantaged retirement account optimization and contribution strategies",
      status: "In Progress", 
      savings: "$8,750",
      complexity: "Low",
      icon: "PiggyBank"
    },
    {
      title: "Investment Tax Optimization",
      description: "Capital gains harvesting and tax-efficient investment placement strategies",
      status: "Planning",
      savings: "$23,300",
      complexity: "High", 
      icon: "TrendingUp"
    },
    {
      title: "Estate Tax Planning",
      description: "Minimize estate taxes through trust structures and gift strategies",
      status: "Planning",
      savings: "$45,000",
      complexity: "High",
      icon: "Users"
    }
  ];

  const upcomingDeadlines = [
    {
      task: "Q4 Estimated Tax Payment",
      date: "January 15, 2025",
      priority: "High",
      amount: "$12,500"
    },
    {
      task: "Business Equipment Purchase",
      date: "December 31, 2024", 
      priority: "Medium",
      amount: "$25,000"
    },
    {
      task: "Retirement Contribution",
      date: "April 15, 2025",
      priority: "Medium",
      amount: "$6,500"
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

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Tax Planning & Optimization</h1>
        <p className="text-lg text-gray-600">Comprehensive strategies to minimize your tax burden and maximize savings</p>
      </div>

      {/* Tax Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-800">$92,250</p>
              <p className="text-sm text-green-700 font-medium">Total Tax Savings</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Target" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-800">4</p>
              <p className="text-sm text-blue-700 font-medium">Active Strategies</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gold-50 to-gold-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gold-800">28%</p>
              <p className="text-sm text-gold-700 font-medium">Effective Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tax Strategies */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Tax Optimization Strategies</h2>
            <div className="space-y-4">
              {taxStrategies.map((strategy, index) => (
                <motion.div
                  key={strategy.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <ApperIcon name={strategy.icon} className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-navy-900">{strategy.title}</h3>
                          <p className={`text-sm font-medium ${getComplexityColor(strategy.complexity)}`}>
                            {strategy.complexity} Complexity
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(strategy.status)} size="sm">
                        {strategy.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {strategy.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="DollarSign" className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">{strategy.savings}</span>
                        <span className="text-sm text-gray-500">annual savings</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                        View Details
                        <ApperIcon name="ChevronRight" className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Calendar" className="h-5 w-5 text-navy-600" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={deadline.task} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-navy-900 text-sm">{deadline.task}</h4>
                      <Badge variant={getPriorityVariant(deadline.priority)} size="sm">
                        {deadline.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{deadline.date}</p>
                    <p className="text-sm font-bold text-green-600">{deadline.amount}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Tax Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Clock" className="h-5 w-5 text-navy-600" />
                Tax Year 2024
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Filing Deadline</span>
                  <span className="text-sm font-semibold text-navy-900">Apr 15, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Extension Deadline</span>
                  <span className="text-sm font-semibold text-navy-900">Oct 15, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Q1 Estimated</span>
                  <span className="text-sm font-semibold text-navy-900">Apr 15, 2025</span>
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy-900">Days Remaining</span>
                  <span className="text-lg font-bold text-red-600">108</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4">Tax Tools</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calculator" className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-blue-600">
                      Tax Calculator
                    </p>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileSpreadsheet" className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-green-600">
                      Deduction Tracker
                    </p>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="PieChart" className="h-4 w-4 text-gold-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-gold-600">
                      Tax Projections
                    </p>
                  </div>
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaxPlanning;