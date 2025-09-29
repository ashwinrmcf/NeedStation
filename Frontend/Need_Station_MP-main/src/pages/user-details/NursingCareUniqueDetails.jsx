import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const NursingCareUniqueDetails = ({ onDataChange, initialData = {} }) => {
  // Get the service configuration for Nursing Care
  const serviceConfig = getServiceConfiguration("NURSING_CARE");

  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="Nursing Care"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default NursingCareUniqueDetails;
