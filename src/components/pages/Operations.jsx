import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getClientById } from "@/services/api/clientService";

export default function Operations() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfitScenario, setSelectedProfitScenario] = useState(75000);
  const [customProfit, setCustomProfit] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(1);
        setClient(clientData);
        setSelectedProfitScenario(clientData.operationsData.businessProfit);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load operations data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const calculateTaxSavings = (profit) => {
    if (profit < 50000) return { selfEmploymentTaxSavings: 0, corporateTaxBenefits: 0, totalAnnualSavings: 0 };
    
    const reasonableSalary = Math.min(profit * 0.6, 65000);
    const distributionAmount = profit - reasonableSalary;
    const selfEmploymentTaxSavings = distributionAmount * 0.1413; // 14.13% self-employment tax
    const corporateTaxBenefits = profit * 0.05; // Estimated 5% in additional deductions
    const totalAnnualSavings = selfEmploymentTaxSavings + corporateTaxBenefits;

    return {
      selfEmploymentTaxSavings: Math.round(selfEmploymentTaxSavings),
      corporateTaxBenefits: Math.round(corporateTaxBenefits),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      reasonableSalary: Math.round(reasonableSalary),
      distributionAmount: Math.round(distributionAmount)
    };
  };

  const handleProfitScenarioChange = (profit) => {
    setSelectedProfitScenario(profit);
    toast.info(`Updated tax calculation for $${profit.toLocaleString()} profit`);
  };

  const handleCustomProfitSubmit = () => {
    const profit = parseInt(customProfit);
    if (profit && profit > 0) {
      setSelectedProfitScenario(profit);
      setCustomProfit("");
      toast.success(`Custom profit scenario: $${profit.toLocaleString()}`);
    } else {
      toast.error("Please enter a valid profit amount");
    }
  };

  const profitScenarios = [50000, 75000, 100000, 125000, 150000, 200000];
  const currentCalculation = calculateTaxSavings(selectedProfitScenario);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!client) return <Error message="Client data not available" />;

  const { operationsData } = client;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations Center</h1>
          <p className="mt-1 text-sm text-gray-600">
            Business entity optimization and tax strategy management
          </p>
        </div>
        <Button className="bg-navy-600 hover:bg-navy-700">
          <ApperIcon name="Download" size={16} className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Current Entity Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Business Entity</h2>
              <Badge variant={operationsData.currentEntityType === "LLC taxed as S-Corp" ? "success" : "warning"}>
                {operationsData.currentEntityType}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Annual Business Profit</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${operationsData.businessProfit.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Recommended Structure</div>
                <div className="text-lg font-semibold text-navy-600">
                  {operationsData.recommendedEntityType}
                </div>
              </div>
            </div>

            {/* Entity Structure Visualization */}
            <div className="bg-white border-2 border-dashed border-gray-200 p-6 rounded-lg">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Entity Structure Flow</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-navy-100 border-2 border-navy-300 rounded-lg p-4 text-center">
                    <ApperIcon name="Building" size={24} className="mx-auto mb-2 text-navy-600" />
                    <div className="text-sm font-medium text-navy-900">LLC</div>
                    <div className="text-xs text-navy-600">Limited Liability Company</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <ApperIcon name="ArrowDown" size={20} className="text-gray-400" />
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-gold-100 border-2 border-gold-300 rounded-lg p-4 text-center">
                    <ApperIcon name="Calculator" size={24} className="mx-auto mb-2 text-gold-600" />
                    <div className="text-sm font-medium text-gold-900">S-Corp Election</div>
                    <div className="text-xs text-gold-600">Tax Treatment Only</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <ApperIcon name="ArrowDown" size={20} className="text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
                    <ApperIcon name="DollarSign" size={20} className="mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-medium text-green-900">Reasonable Salary</div>
                    <div className="text-xs text-green-600">${currentCalculation.reasonableSalary?.toLocaleString()}</div>
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-center">
                    <ApperIcon name="TrendingUp" size={20} className="mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium text-blue-900">Distribution</div>
                    <div className="text-xs text-blue-600">${currentCalculation.distributionAmount?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
            <div className="space-y-3">
              {Object.entries(operationsData.complianceStatus).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge variant={status ? "success" : "destructive"}>
                    {status ? "Complete" : "Needed"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Tax Savings Calculator */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Savings Calculator</h2>
          <p className="text-sm text-gray-600 mb-6">
            Calculate potential tax savings for different profit scenarios with LLC taxed as S-Corp structure.
          </p>

          {/* Profit Scenario Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Profit Scenario
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {profitScenarios.map((profit) => (
                <Button
                  key={profit}
                  variant={selectedProfitScenario === profit ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleProfitScenarioChange(profit)}
                  className={selectedProfitScenario === profit ? "bg-navy-600 hover:bg-navy-700" : ""}
                >
                  ${profit.toLocaleString()}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Custom amount"
                value={customProfit}
                onChange={(e) => setCustomProfit(e.target.value)}
                className="w-32"
              />
              <Button size="sm" onClick={handleCustomProfitSubmit}>
                Calculate
              </Button>
            </div>
          </div>

          {/* Tax Savings Results */}
          {selectedProfitScenario >= 50000 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <ApperIcon name="Shield" size={16} className="text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Self-Employment Tax Savings</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${currentCalculation.selfEmploymentTaxSavings.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  14.13% on distributions
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <ApperIcon name="Receipt" size={16} className="text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Corporate Tax Benefits</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${currentCalculation.corporateTaxBenefits.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">
                  Additional deductions
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-navy-50 border border-navy-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  <ApperIcon name="TrendingUp" size={16} className="text-navy-600 mr-2" />
                  <span className="text-sm font-medium text-navy-800">Total Annual Savings</span>
                </div>
                <div className="text-2xl font-bold text-navy-600">
                  ${currentCalculation.totalAnnualSavings.toLocaleString()}
                </div>
                <div className="text-xs text-navy-600">
                  Combined tax benefits
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ApperIcon name="AlertTriangle" size={16} className="text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">
                  S-Corp election recommended for businesses with $50,000+ annual profit
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Entity Structure Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Structure</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payroll Setup</span>
                <Badge variant={operationsData.entityStructure.hasPayrollSetup ? "success" : "destructive"}>
                  {operationsData.entityStructure.hasPayrollSetup ? "Active" : "Required"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reasonable Salary</span>
                <span className="font-medium">${operationsData.entityStructure.reasonableSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Distribution Amount</span>
                <span className="font-medium">${operationsData.entityStructure.distributionAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quarterly Filings</span>
                <Badge variant="outline">{operationsData.entityStructure.quarterlyFilings}</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3">
              {operationsData.businessProfit >= 50000 && operationsData.currentEntityType !== "LLC taxed as S-Corp" && (
                <div className="flex items-start space-x-3">
                  <div className="bg-navy-100 p-1 rounded">
                    <ApperIcon name="ArrowRight" size={14} className="text-navy-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">File S-Corp Election</div>
                    <div className="text-xs text-gray-600">Form 2553 with IRS</div>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <div className="bg-navy-100 p-1 rounded">
                  <ApperIcon name="ArrowRight" size={14} className="text-navy-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Setup Payroll System</div>
                  <div className="text-xs text-gray-600">Establish reasonable salary</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-navy-100 p-1 rounded">
                  <ApperIcon name="ArrowRight" size={14} className="text-navy-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Quarterly Planning</div>
                  <div className="text-xs text-gray-600">Review distributions and compliance</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}