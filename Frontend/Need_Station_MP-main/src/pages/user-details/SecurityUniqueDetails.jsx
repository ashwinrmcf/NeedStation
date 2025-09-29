import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const SecurityUniqueDetails = ({ onDataChange, initialData = {} }) => {
  // Get the service configuration for Home Security Guard
  const serviceConfig = getServiceConfiguration("HOME_SECURITY_GUARD");

  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="Home Security Guard"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default SecurityUniqueDetails;
