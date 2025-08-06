import React from "react";
import { motion } from "framer-motion";
import DocumentsTable from "@/components/organisms/DocumentsTable";

const Documents = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <DocumentsTable />
    </motion.div>
  );
};

export default Documents;