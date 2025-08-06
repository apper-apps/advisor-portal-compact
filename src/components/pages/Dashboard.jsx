import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getActionItemsByClient } from "@/services/api/actionItemService";
import { getClientById } from "@/services/api/clientService";
import ApperIcon from "@/components/ApperIcon";
import TrifectaOverview from "@/components/organisms/TrifectaOverview";
import ActionItemsWidget from "@/components/organisms/ActionItemsWidget";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Operations from "@/components/pages/Operations";
import Documents from "@/components/pages/Documents";
import Foundation from "@/components/pages/Foundation";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const Dashboard = () => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        // Using client ID 1 as default - in real app this would come from auth/context
        const data = await getClientById(1);
        setClientData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getStats = () => {
    if (!clientData?.financialMetrics) return [];
    
    const metrics = clientData.financialMetrics;
    
    return [
      {
        label: "Tax Savings YTD",
        value: formatCurrency(metrics.taxSavingsYTD.currentYear),
        change: formatPercentage(metrics.taxSavingsYTD.changePercent),
        changeType: metrics.taxSavingsYTD.changePercent >= 0 ? "positive" : "negative",
        icon: "DollarSign",
        gradient: "from-green-500 to-green-600",
        progress: Math.min((metrics.taxSavingsYTD.currentYear / metrics.taxSavingsYTD.targetYear) * 100, 100)
      },
      {
        label: "Protected Assets",
        value: formatCurrency(metrics.assetProtection.totalProtected),
        change: `${metrics.assetProtection.coveragePercent}% coverage`,
        changeType: metrics.assetProtection.coveragePercent >= 80 ? "positive" : "neutral",
        icon: "Shield",
        gradient: "from-blue-500 to-blue-600",
        progress: metrics.assetProtection.coveragePercent
      },
      {
        label: "Portfolio Value",
        value: formatCurrency(metrics.portfolioValue.current),
        change: formatPercentage(metrics.portfolioValue.growthPercent),
        changeType: metrics.portfolioValue.growthPercent >= 0 ? "positive" : "negative",
        icon: "TrendingUp",
        gradient: "from-gold-500 to-gold-600",
        progress: Math.min((metrics.portfolioValue.current / metrics.portfolioValue.target) * 100, 100)
      },
      {
        label: "Wealth Goal Progress",
        value: `${metrics.wealthGoals.overallProgress}%`,
        change: `${metrics.wealthGoals.completedMilestones}/${metrics.wealthGoals.totalMilestones} milestones`,
        changeType: metrics.wealthGoals.overallProgress >= 75 ? "positive" : "neutral",
        icon: "Target",
        gradient: "from-purple-500 to-purple-600",
        progress: metrics.wealthGoals.overallProgress
      }
    ];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  const stats = getStats();

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
            <Card className="p-6 h-full relative overflow-hidden">
              {/* Progress indicator background */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-30"
                style={{ width: `${stat.progress}%` }}
              />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
                  </div>
                  <Badge 
                    variant={stat.changeType === "positive" ? "success" : stat.changeType === "negative" ? "destructive" : "default"}
                    size="sm"
                  >
                    {stat.change}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <p className="text-2xl font-bold text-navy-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className={`h-2 bg-gradient-to-r ${stat.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {stat.progress.toFixed(0)}%
                </p>
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

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Action Items Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ActionItemsWidget />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
            transition={{ duration: 0.5, delay: 0.5 }}
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
                  <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Building2" className="h-4 w-4 text-navy-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-navy-600">
                      Foundation Setup
                    </p>
                    <p className="text-xs text-gray-600">Manage trust and estate plan</p>
                  </div>
                  <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400 group-hover:text-navy-600" />
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

      {/* Action Items Widget Component */}
      <ActionItemsWidget />
    </div>
  );
};

export default Dashboard;