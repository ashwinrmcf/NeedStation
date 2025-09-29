import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const ParkinsonsUniqueDetails = ({ onDataChange, initialData = {} }) => {
  // Get the service configuration for Parkinson's Care
  const serviceConfig = getServiceConfiguration("PARKINSONS_CARE");

  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="Parkinson's Care"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default ParkinsonsUniqueDetails;
