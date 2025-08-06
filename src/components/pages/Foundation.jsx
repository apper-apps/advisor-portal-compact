import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import DocumentsTable from "@/components/organisms/DocumentsTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getClientById } from "@/services/api/clientService";

const Foundation = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError("");
      const clientData = await getClientById(1); // Using John Smith's ID
      setClient(clientData);
    } catch (err) {
      setError("Failed to load client data. Please try again.");
      console.error("Error loading client data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, []);

  const trustBenefits = [
    {
      icon: "Shield",
      title: "Privacy Protection",
      description: "Keep your estate matters private and avoid public probate proceedings",
      gradient: "from-blue-500 to-blue-600",
      features: ["No public record", "Confidential asset transfer", "Family privacy maintained"]
    },
    {
      icon: "Users",
      title: "Legacy Building",
      description: "Ensure smooth wealth transfer to your beneficiaries across generations",
      gradient: "from-gold-500 to-gold-600",
      features: ["Multi-generational planning", "Successor trustee designation", "Flexible distribution terms"]
    },
    {
      icon: "Clock",
      title: "Probate Avoidance",
      description: "Bypass lengthy and costly probate court processes",
      gradient: "from-green-500 to-green-600",
      features: ["Immediate asset access", "Reduced legal costs", "Faster distribution process"]
    },
    {
      icon: "Banknote",
      title: "Tax Optimization",
      description: "Maximize tax efficiency in estate planning and wealth transfer",
      gradient: "from-purple-500 to-purple-600",
      features: ["Estate tax planning", "Generation-skipping strategies", "Income tax management"]
    }
  ];

  const foundationSteps = [
    {
      step: 1,
      title: "Trust Creation",
      description: "Establish your revocable living trust with customized terms",
      status: client?.foundationStatus?.trustCreated ? "completed" : "pending"
    },
    {
      step: 2,
      title: "Asset Funding",
      description: "Transfer assets into the trust for full protection",
      status: client?.foundationStatus?.assetsFunded ? "completed" : "pending"
    },
    {
      step: 3,
      title: "Successor Planning",
      description: "Designate and prepare successor trustees",
      status: client?.foundationStatus?.successorDesignated ? "completed" : "pending"
    },
    {
      step: 4,
      title: "Legacy Framework",
      description: "Implement multi-generational wealth transfer strategies",
      status: client?.foundationStatus?.legacyFramework ? "completed" : "pending"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success" size="sm">Completed</Badge>;
      case "in-progress":
        return <Badge variant="warning" size="sm">In Progress</Badge>;
      default:
        return <Badge variant="default" size="sm">Pending</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return { icon: "CheckCircle", color: "text-green-600", bg: "bg-green-100" };
      case "in-progress":
        return { icon: "Clock", color: "text-yellow-600", bg: "bg-yellow-100" };
      default:
        return { icon: "Circle", color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClientData} />;

  return (
    <div className="space-y-8">
      {/* Header Section */}
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
              <h1 className="text-2xl font-bold">Foundation - Revocable Living Trust</h1>
              <p className="text-blue-100">The cornerstone of your estate planning strategy</p>
            </div>
          </div>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            Your Foundation establishes a revocable living trust as the bedrock of your estate plan. 
            This powerful tool provides privacy protection, probate avoidance, and seamless wealth 
            transfer while maintaining complete control during your lifetime.
          </p>
        </div>
      </motion.div>

      {/* Trust Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-navy-900">Your Trust Status</h2>
              <p className="text-gray-600 mt-1">Track your foundation setup progress</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-navy-900">
                {client?.foundationStatus?.overallProgress || "25"}%
              </div>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {foundationSteps.map((step, index) => {
              const statusStyle = getStatusIcon(step.status);
              
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 ${statusStyle.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <ApperIcon name={statusStyle.icon} className={`h-4 w-4 ${statusStyle.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">STEP {step.step}</span>
                        {getStatusBadge(step.status)}
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-navy-900 mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Trust Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Estate Planning Benefits</h2>
          <p className="text-gray-600">Comprehensive protection and optimization for your legacy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trustBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <ApperIcon name={benefit.icon} className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-navy-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 mb-4">{benefit.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                      <ApperIcon name="Check" className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Foundation Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Foundation Documents</h2>
          <p className="text-gray-600">Access your trust documents and estate planning materials</p>
        </div>

        <DocumentsTable category="Foundation" />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => toast.success("Consultation request submitted successfully!")}
              className="flex-1 sm:flex-none"
            >
              <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => toast.info("Trust review materials will be sent to your email.")}
              className="flex-1 sm:flex-none"
            >
              <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
              Request Trust Review
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Foundation;