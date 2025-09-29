import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const ElderlyCareUniqueDetails = ({ onDataChange, initialData = {} }) => {
  // Get the service configuration for Elderly Care
  const serviceConfig = getServiceConfiguration("ELDERLY_CARE");

  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="Elderly Care"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default ElderlyCareUniqueDetails;
