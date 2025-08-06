import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const WealthBuilding = () => {
  const portfolioAllocation = [
    { category: "Stocks", percentage: 45, amount: "$540,000", color: "from-blue-500 to-blue-600" },
    { category: "Bonds", percentage: 25, amount: "$300,000", color: "from-green-500 to-green-600" },
    { category: "Real Estate", percentage: 20, amount: "$240,000", color: "from-gold-500 to-gold-600" },
    { category: "Alternative", percentage: 10, amount: "$120,000", color: "from-purple-500 to-purple-600" }
  ];

  const investmentGoals = [
    {
      title: "Retirement Planning",
      target: "$2,500,000",
      current: "$1,200,000",
      progress: 48,
      timeframe: "15 years",
      icon: "PiggyBank",
      status: "On Track"
    },
    {
      title: "Education Fund",
      target: "$400,000", 
      current: "$150,000",
      progress: 37,
      timeframe: "8 years",
      icon: "GraduationCap",
      status: "Ahead"
    },
    {
      title: "Emergency Fund",
      target: "$100,000",
      current: "$85,000",
      progress: 85,
      timeframe: "Complete",
      icon: "Shield",
      status: "Nearly Complete"
    }
  ];

  const recentPerformance = [
    { period: "1 Month", return: "+2.4%", benchmark: "+1.8%", status: "outperforming" },
    { period: "3 Months", return: "+7.2%", benchmark: "+6.1%", status: "outperforming" },
    { period: "1 Year", return: "+15.8%", benchmark: "+12.3%", status: "outperforming" },
    { period: "3 Years", return: "+8.9%", benchmark: "+7.2%", status: "outperforming" }
  ];

const upcomingActions = [
    {
      action: "Portfolio Rebalancing",
      description: "Quarterly rebalancing scheduled",
      date: "January 15, 2025",
      priority: "Medium",
      icon: "RefreshCw"
    },
    {
      action: "Tax Loss Harvesting",
      description: "Review positions for tax optimization",
      date: "December 31, 2024",
      priority: "High", 
      icon: "TrendingDown"
    },
    {
      action: "Contribution Review",
      description: "Annual contribution limit assessment",
      date: "February 1, 2025",
      priority: "Low",
      icon: "DollarSign"
    }
  ];

  // Holdings data
  const holdingsData = {
    rentalProperties: [
      {
        Id: 1,
        address: "123 Maple Street, Austin, TX",
        purchaseDate: "2020-03-15",
        purchasePrice: 285000,
        currentValue: 342000,
        monthlyRent: 2400,
        expenses: 1850,
        netIncome: 550,
        depreciationRate: 3.636,
        annualDepreciation: 10364,
        occupancyRate: 95,
        status: "Occupied"
      },
      {
        Id: 2,
        address: "456 Oak Avenue, Dallas, TX",
        purchaseDate: "2021-08-22",
        purchasePrice: 195000,
        currentValue: 218000,
        monthlyRent: 1650,
        expenses: 1200,
        netIncome: 450,
        depreciationRate: 3.636,
        annualDepreciation: 7091,
        occupancyRate: 100,
        status: "Occupied"
      }
    ],
    retirementAccounts: [
      {
        Id: 1,
        accountType: "Self-Directed IRA",
        provider: "Quest Trust Company",
        balance: 245000,
        contributionLimit: 7500,
        contributedThisYear: 7500,
        growth: 12.8,
        lastContribution: "2024-11-15",
        investments: "Real Estate, Private Lending",
        status: "Active"
      },
      {
        Id: 2,
        accountType: "Solo 401(k)",
        provider: "Fidelity",
        balance: 89000,
        contributionLimit: 70000,
        contributedThisYear: 28000,
        growth: 8.4,
        lastContribution: "2024-12-01",
        investments: "Index Funds, Individual Stocks",
        status: "Active"
      }
    ],
    passiveIncomeStreams: [
      {
        Id: 1,
        source: "Dividend Portfolio",
        type: "Stock Dividends",
        monthlyIncome: 1250,
        annualYield: 4.2,
        totalInvested: 357000,
        growth: 6.8,
        nextPayment: "2025-01-15",
        status: "Active"
      },
      {
        Id: 2,
        source: "REIT Investments",
        type: "Real Estate Investment Trust",
        monthlyIncome: 890,
        annualYield: 7.1,
        totalInvested: 150000,
        growth: 3.2,
        nextPayment: "2025-01-10",
        status: "Active"
      },
      {
        Id: 3,
        source: "Private Lending",
        type: "Peer-to-Peer Lending",
        monthlyIncome: 425,
        annualYield: 9.8,
        totalInvested: 52000,
        growth: 9.1,
        nextPayment: "2025-01-05",
        status: "Active"
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "on track":
        return "success";
      case "ahead":
        return "info";
      case "nearly complete":
        return "warning";
      default:
        return "default";
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

  const getPerformanceColor = (status) => {
    return status === "outperforming" ? "text-green-600" : "text-red-600";
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
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Wealth Building & Portfolio Management</h1>
        <p className="text-lg text-gray-600">Strategic investment management for long-term wealth accumulation</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-navy-50 to-navy-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-800 rounded-xl flex items-center justify-center">
              <ApperIcon name="Wallet" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">$1.2M</p>
              <p className="text-sm text-navy-700 font-medium">Total Portfolio</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-800">+15.8%</p>
              <p className="text-sm text-green-700 font-medium">YTD Return</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Target" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-800">3</p>
              <p className="text-sm text-blue-700 font-medium">Active Goals</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gold-50 to-gold-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Award" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gold-800">A+</p>
              <p className="text-sm text-gold-700 font-medium">Risk Score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Portfolio & Goals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio Allocation */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Portfolio Allocation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolioAllocation.map((allocation, index) => (
                <motion.div
                  key={allocation.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-navy-900">{allocation.category}</h3>
                      <span className="text-2xl font-bold text-navy-900">{allocation.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <motion.div
                        className={`h-3 rounded-full bg-gradient-to-r ${allocation.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${allocation.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                    <p className="text-lg font-bold text-gray-700">{allocation.amount}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Investment Goals */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Investment Goals</h2>
            <div className="space-y-4">
              {investmentGoals.map((goal, index) => (
                <motion.div
                  key={goal.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <ApperIcon name={goal.icon} className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-navy-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600">{goal.timeframe}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(goal.status)} size="sm">
                        {goal.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-navy-900">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.3 }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current: <strong className="text-navy-900">{goal.current}</strong></span>
                        <span className="text-gray-600">Target: <strong className="text-navy-900">{goal.target}</strong></span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Holdings Section */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Investment Holdings</h2>
            
            {/* Rental Properties */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Rental Properties</h3>
              <div className="space-y-4">
                {holdingsData.rentalProperties.map((property, index) => (
                  <motion.div
                    key={property.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Home" className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-navy-900">{property.address}</h4>
                            <p className="text-sm text-gray-600">Purchased: {new Date(property.purchaseDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge variant={property.status === "Occupied" ? "success" : "warning"} size="sm">
                          {property.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Purchase Price</p>
                          <p className="font-bold text-navy-900">${property.purchasePrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Current Value</p>
                          <p className="font-bold text-navy-900">${property.currentValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Rent</p>
                          <p className="font-bold text-green-600">${property.monthlyRent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Net Income</p>
                          <p className="font-bold text-green-600">${property.netIncome.toLocaleString()}/mo</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Annual Depreciation</p>
                            <p className="font-bold text-navy-900">${property.annualDepreciation.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Occupancy Rate</p>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: `${property.occupancyRate}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-navy-900">{property.occupancyRate}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Equity Gain</p>
                            <p className="font-bold text-blue-600">
                              ${(property.currentValue - property.purchasePrice).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Self-Directed Retirement Accounts */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Self-Directed Retirement Accounts</h3>
              <div className="space-y-4">
                {holdingsData.retirementAccounts.map((account, index) => (
                  <motion.div
                    key={account.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                            <ApperIcon name="PiggyBank" className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-navy-900">{account.accountType}</h4>
                            <p className="text-sm text-gray-600">{account.provider}</p>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">{account.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Balance</p>
                          <p className="font-bold text-navy-900">${account.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Annual Growth</p>
                          <p className="font-bold text-green-600">{account.growth}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contribution Limit</p>
                          <p className="font-bold text-navy-900">${account.contributionLimit.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contributed YTD</p>
                          <p className="font-bold text-blue-600">${account.contributedThisYear.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">Contribution Progress</p>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${(account.contributedThisYear / account.contributionLimit) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.3 }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>${account.contributedThisYear.toLocaleString()}</span>
                            <span>${account.contributionLimit.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Investments</p>
                            <p className="font-semibold text-navy-900">{account.investments}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Last Contribution</p>
                            <p className="font-semibold text-navy-900">{new Date(account.lastContribution).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Passive Income Streams */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Passive Income Streams</h3>
              <div className="space-y-4">
                {holdingsData.passiveIncomeStreams.map((stream, index) => (
                  <motion.div
                    key={stream.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                            <ApperIcon name="TrendingUp" className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-navy-900">{stream.source}</h4>
                            <p className="text-sm text-gray-600">{stream.type}</p>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">{stream.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Monthly Income</p>
                          <p className="font-bold text-green-600">${stream.monthlyIncome.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Annual Yield</p>
                          <p className="font-bold text-navy-900">{stream.annualYield}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Invested</p>
                          <p className="font-bold text-navy-900">${stream.totalInvested.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">YTD Growth</p>
                          <p className="font-bold text-blue-600">{stream.growth}%</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Next Payment</p>
                            <p className="font-semibold text-navy-900">{new Date(stream.nextPayment).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Annual Income</p>
                            <p className="font-bold text-green-600">${(stream.monthlyIncome * 12).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Investment Performance Summary */}
            <div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">Performance Summary</h3>
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name="DollarSign" className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Total Holdings Value</p>
                    <p className="text-2xl font-bold text-navy-900">
                      ${(
                        holdingsData.rentalProperties.reduce((sum, p) => sum + p.currentValue, 0) +
                        holdingsData.retirementAccounts.reduce((sum, a) => sum + a.balance, 0) +
                        holdingsData.passiveIncomeStreams.reduce((sum, s) => sum + s.totalInvested, 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name="TrendingUp" className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Monthly Passive Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${(
                        holdingsData.rentalProperties.reduce((sum, p) => sum + p.netIncome, 0) +
                        holdingsData.passiveIncomeStreams.reduce((sum, s) => sum + s.monthlyIncome, 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name="Percent" className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">Annual Depreciation</p>
                    <p className="text-2xl font-bold text-navy-900">
                      ${holdingsData.rentalProperties.reduce((sum, p) => sum + p.annualDepreciation, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ApperIcon name="Target" className="h-6 w-6 text-gold-600" />
                    </div>
                    <p className="text-sm text-gray-600">Avg. Portfolio Growth</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(
                        holdingsData.retirementAccounts.reduce((sum, a) => sum + a.growth, 0) / holdingsData.retirementAccounts.length
                      ).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Column - Performance & Actions */}
        <div className="space-y-6">
          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-navy-600" />
                Performance vs Benchmark
              </h3>
              <div className="space-y-4">
                {recentPerformance.map((perf, index) => (
                  <div key={perf.period} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{perf.period}</p>
                      <p className="text-xs text-gray-600">vs S&P 500</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${getPerformanceColor(perf.status)}`}>
                        {perf.return}
                      </p>
                      <p className="text-xs text-gray-500">{perf.benchmark}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <ApperIcon name="CheckSquare" className="h-5 w-5 text-navy-600" />
                Upcoming Actions
              </h3>
              <div className="space-y-4">
                {upcomingActions.map((action, index) => (
                  <div key={action.action} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ApperIcon name={action.icon} className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold text-navy-900 text-sm">{action.action}</h4>
                      </div>
                      <Badge variant={getPriorityVariant(action.priority)} size="sm">
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{action.description}</p>
                    <p className="text-xs text-gray-500">{action.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Investment Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4">Investment Tools</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="PieChart" className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-blue-600">
                      Risk Assessment
                    </p>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calculator" className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-green-600">
                      Return Calculator
                    </p>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Target" className="h-4 w-4 text-gold-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-gold-600">
                      Goal Planner
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

export default WealthBuilding;