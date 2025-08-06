import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
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
// Tax Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    businessIncome: 150000,
    businessExpenses: 30000,
    currentEntity: 'sole-proprietorship',
    rentalIncome: 0,
    rentalExpenses: 0,
    currentTaxRate: 0.24,
    filingStatus: 'married-joint'
  });

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

  // Calculator Functions
  const calculateCurrentTax = () => {
    const businessProfit = calculatorInputs.businessIncome - calculatorInputs.businessExpenses;
    const rentalProfit = Math.max(0, calculatorInputs.rentalIncome - calculatorInputs.rentalExpenses);
    const totalIncome = businessProfit + rentalProfit;
    
    let selfEmploymentTax = 0;
    if (calculatorInputs.currentEntity === 'sole-proprietorship') {
      selfEmploymentTax = businessProfit * 0.1413; // 14.13% SE tax
    }
    
    const incomeTax = totalIncome * calculatorInputs.currentTaxRate;
    return incomeTax + selfEmploymentTax;
  };

  const calculateOptimizedTax = () => {
    const businessProfit = calculatorInputs.businessIncome - calculatorInputs.businessExpenses;
    const rentalProfit = Math.max(0, calculatorInputs.rentalIncome - calculatorInputs.rentalExpenses);
    
    // S-Corp optimization
    const reasonableWage = Math.min(businessProfit * 0.6, 70000);
    const distributions = Math.max(0, businessProfit - reasonableWage);
    
    // SE tax only on wages
    const selfEmploymentTax = reasonableWage * 0.1413;
    
    // Income tax on all business profit + rental
    const incomeTax = (businessProfit + rentalProfit) * calculatorInputs.currentTaxRate;
    
    // Additional deductions through Trifecta strategies
    const additionalDeductions = 15000; // Conservative estimate
    const deductionSavings = additionalDeductions * calculatorInputs.currentTaxRate;
    
    return Math.max(0, incomeTax + selfEmploymentTax - deductionSavings);
  };

  const handleCalculatorSubmit = () => {
    const currentTax = calculateCurrentTax();
    const optimizedTax = calculateOptimizedTax();
    const savings = currentTax - optimizedTax;
    
    toast.success(`Potential annual savings: $${savings.toLocaleString()}! Schedule a consultation to learn more.`, {
      autoClose: 5000
    });
  };

  const updateCalculatorInput = (field, value) => {
    setCalculatorInputs(prev => ({
      ...prev,
      [field]: value
    }));
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

          {/* Interactive Tax Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-navy-900">Trifecta Tax Savings Calculator</h3>
                <Button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="px-4 py-2"
                >
                  <ApperIcon name={showCalculator ? "ChevronUp" : "Calculator"} className="h-4 w-4 mr-2" />
                  {showCalculator ? "Hide" : "Calculate"}
                </Button>
              </div>

              {showCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Business Income Section */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-3 flex items-center">
                      <ApperIcon name="Building2" className="h-4 w-4 mr-2 text-blue-600" />
                      Business Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Annual Business Income
                        </label>
                        <Input
                          type="number"
                          value={calculatorInputs.businessIncome}
                          onChange={(e) => updateCalculatorInput('businessIncome', parseFloat(e.target.value) || 0)}
                          placeholder="150000"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Business Expenses
                        </label>
                        <Input
                          type="number"
                          value={calculatorInputs.businessExpenses}
                          onChange={(e) => updateCalculatorInput('businessExpenses', parseFloat(e.target.value) || 0)}
                          placeholder="30000"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Current Entity Type
                        </label>
                        <select
                          value={calculatorInputs.currentEntity}
                          onChange={(e) => updateCalculatorInput('currentEntity', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-navy-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="sole-proprietorship">Sole Proprietorship</option>
                          <option value="llc">LLC</option>
                          <option value="s-corp">S-Corporation</option>
                          <option value="c-corp">C-Corporation</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Rental Income Section */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-3 flex items-center">
                      <ApperIcon name="Home" className="h-4 w-4 mr-2 text-green-600" />
                      Rental Property Income
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Annual Rental Income
                        </label>
                        <Input
                          type="number"
                          value={calculatorInputs.rentalIncome}
                          onChange={(e) => updateCalculatorInput('rentalIncome', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Rental Expenses
                        </label>
                        <Input
                          type="number"
                          value={calculatorInputs.rentalExpenses}
                          onChange={(e) => updateCalculatorInput('rentalExpenses', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Tax Situation */}
                  <div className="bg-gold-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-3 flex items-center">
                      <ApperIcon name="FileText" className="h-4 w-4 mr-2 text-gold-600" />
                      Current Tax Situation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Current Tax Rate
                        </label>
                        <select
                          value={calculatorInputs.currentTaxRate}
                          onChange={(e) => updateCalculatorInput('currentTaxRate', parseFloat(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-navy-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={0.12}>12% - $22,000 - $89,450</option>
                          <option value={0.22}>22% - $89,450 - $190,750</option>
                          <option value={0.24}>24% - $190,750 - $364,200</option>
                          <option value={0.32}>32% - $364,200 - $462,500</option>
                          <option value={0.35}>35% - $462,500 - $693,750</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Filing Status
                        </label>
                        <select
                          value={calculatorInputs.filingStatus}
                          onChange={(e) => updateCalculatorInput('filingStatus', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-navy-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="single">Single</option>
                          <option value="married-joint">Married Filing Jointly</option>
                          <option value="married-separate">Married Filing Separately</option>
                          <option value="head-of-household">Head of Household</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="bg-navy-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-4 flex items-center">
                      <ApperIcon name="TrendingUp" className="h-4 w-4 mr-2 text-navy-600" />
                      Projected Tax Savings
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-sm text-navy-600 mb-1">Current Annual Tax</p>
                        <p className="text-2xl font-bold text-red-600">
                          ${calculateCurrentTax().toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-sm text-navy-600 mb-1">Optimized Tax</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${calculateOptimizedTax().toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg">
                        <p className="text-sm mb-1">Annual Savings</p>
                        <p className="text-2xl font-bold">
                          ${(calculateCurrentTax() - calculateOptimizedTax()).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg mb-4">
                      <h5 className="font-semibold text-navy-900 mb-2">Optimization Strategies Include:</h5>
                      <ul className="space-y-1 text-sm text-navy-700">
                        <li className="flex items-center">
                          <ApperIcon name="Check" className="h-3 w-3 mr-2 text-green-600" />
                          S-Corporation election to reduce self-employment tax
                        </li>
                        <li className="flex items-center">
                          <ApperIcon name="Check" className="h-3 w-3 mr-2 text-green-600" />
                          Strategic business expense optimization
                        </li>
                        <li className="flex items-center">
                          <ApperIcon name="Check" className="h-3 w-3 mr-2 text-green-600" />
                          Rental property tax benefit maximization
                        </li>
                        <li className="flex items-center">
                          <ApperIcon name="Check" className="h-3 w-3 mr-2 text-green-600" />
                          Additional deduction strategies
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleCalculatorSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3"
                    >
                      <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                      Schedule Consultation to Implement These Savings
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Other Tax Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4">Additional Tax Tools</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => toast.info("Deduction tracker coming soon!")}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileSpreadsheet" className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 group-hover:text-green-600">
                      Deduction Tracker
                    </p>
                  </div>
                </button>
                
                <button 
                  onClick={() => toast.info("Tax projections tool coming soon!")}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors group"
                >
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