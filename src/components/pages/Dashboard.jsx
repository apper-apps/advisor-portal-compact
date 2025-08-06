import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import TrifectaOverview from "@/components/organisms/TrifectaOverview";

const Dashboard = () => {
  const stats = [
    {
      label: "Tax Savings YTD",
      value: "$47,250",
      change: "+18.2%",
      changeType: "positive",
      icon: "DollarSign",
      gradient: "from-green-500 to-green-600"
    },
    {
      label: "Protected Assets",
      value: "$1.2M",
      change: "+5.1%",
      changeType: "positive",
      icon: "Shield",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      label: "Portfolio Growth",
      value: "$156K",
      change: "+12.8%",
      changeType: "positive",
      icon: "TrendingUp",
      gradient: "from-gold-500 to-gold-600"
    },
    {
      label: "Active Strategies",
      value: "7",
      change: "+2 new",
      changeType: "neutral",
      icon: "Target",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Tax Planning Document",
      description: "Q4 2024 Tax Strategy uploaded",
      time: "2 hours ago",
      type: "document",
      icon: "FileText"
    },
    {
      id: 2,
      action: "Asset Protection Update",
      description: "LLC structure optimization completed",
      time: "1 day ago",
      type: "update",
      icon: "Shield"
    },
    {
      id: 3,
      action: "Investment Allocation",
      description: "Portfolio rebalancing scheduled",
      time: "3 days ago",
      type: "investment",
      icon: "TrendingUp"
    },
    {
      id: 4,
      action: "Compliance Review",
      description: "Annual tax compliance check completed",
      time: "1 week ago",
      type: "compliance",
      icon: "CheckCircle"
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "document":
        return { color: "text-blue-600", bg: "bg-blue-100" };
      case "update":
        return { color: "text-green-600", bg: "bg-green-100" };
      case "investment":
        return { color: "text-gold-600", bg: "bg-gold-100" };
      case "compliance":
        return { color: "text-purple-600", bg: "bg-purple-100" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Building2" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome to Your Trifecta Portal</h1>
              <p className="text-blue-100">Comprehensive financial optimization at your fingertips</p>
            </div>
          </div>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            Your dedicated portal provides complete access to our three-pillar Trifecta System: 
            Foundation (tax optimization), Operations (asset protection), and Holdings (wealth building). 
            Track your progress, access documents, and monitor your financial optimization journey.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
                </div>
                <Badge 
                  variant={stat.changeType === "positive" ? "success" : "default"}
                  size="sm"
                >
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Trifecta Overview */}
        <div className="xl:col-span-2">
          <TrifectaOverview />
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-navy-900">Recent Activity</h3>
                <ApperIcon name="Clock" className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const iconStyle = getActivityIcon(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-8 h-8 ${iconStyle.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <ApperIcon name={activity.icon} className={`h-4 w-4 ${iconStyle.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-blue-600">
                      View Documents
                    </p>
                    <p className="text-xs text-gray-600">Access your latest files</p>
                  </div>
                  <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calculator" className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-green-600">
                      Tax Planning Tools
                    </p>
                    <p className="text-xs text-gray-600">Explore optimization strategies</p>
                  </div>
                  <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="TrendingUp" className="h-4 w-4 text-gold-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-gold-600">
                      Wealth Dashboard
                    </p>
                    <p className="text-xs text-gray-600">Monitor portfolio growth</p>
                  </div>
                  <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400 group-hover:text-gold-600" />
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;