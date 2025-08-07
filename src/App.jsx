import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Documents from "@/components/pages/Documents";
import Foundation from "@/components/pages/Foundation";
import TaxPlanning from "@/components/pages/TaxPlanning";
import WealthBuilding from "@/components/pages/WealthBuilding";
import Operations from "@/components/pages/Operations";
import Appointments from "@/components/pages/Appointments";
import ActionItems from "@/components/pages/ActionItems";
import EducationalResources from "@/components/pages/EducationalResources";
import Messages from "@/components/pages/Messages";
import ComplianceAlerts from "@/components/pages/ComplianceAlerts";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
<div className="lg:pl-64">
          <Header onMenuToggle={handleMenuToggle} clientName="John Smith" />
          
          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
<Route path="/foundation" element={<Foundation />} />
              <Route path="/tax-planning" element={<TaxPlanning />} />
              <Route path="/wealth-building" element={<WealthBuilding />} />
<Route path="/operations" element={<Operations />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/action-items" element={<ActionItems />} />
              <Route path="/educational-resources" element={<EducationalResources />} />
<Route path="/messages" element={<Messages />} />
              <Route path="/compliance-alerts" element={<ComplianceAlerts />} />
            </Routes>
          </main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;