import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const HealthCheckupUniqueDetails = ({ onDataChange, initialData = {} }) => {
  // Get the service configuration for Health Check Up Service
  const serviceConfig = getServiceConfiguration("HEALTH_CHECK_UP_SERVICE");

  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="Health Check Up Services"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default HealthCheckupUniqueDetails;
