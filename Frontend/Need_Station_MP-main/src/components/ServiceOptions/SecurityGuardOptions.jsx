import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { securityGuardData } from '../../data/ServiceData/SecurityGuardData';

const SecurityGuardOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={securityGuardData.serviceName}
      serviceDescription={securityGuardData.serviceDescription}
      serviceHighlight={securityGuardData.serviceHighlight}
      services={securityGuardData.services}
      trustIndicators={securityGuardData.trustIndicators}
      detailedInfo={securityGuardData.detailedInfo}
    />
  );
};

export default SecurityGuardOptions;