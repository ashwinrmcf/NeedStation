import React from "react";
import ServiceFormTemplate from "../../components/ServiceForms/ServiceFormTemplate";
import { getServiceConfiguration } from "../../data/ServiceConfigurations";

const BedriddenPatientUniqueDetails = ({ onDataChange, initialData = {} }) => {
  // Get the service configuration for Bedridden Patient Care
  const serviceConfig = getServiceConfiguration("BEDRIDDEN_PATIENT_CARE");

  return (
    <ServiceFormTemplate
      serviceConfig={serviceConfig}
      serviceName="Bedridden Patient Care"
      onDataChange={onDataChange}
      initialData={initialData}
    />
  );
};

export default BedriddenPatientUniqueDetails;
