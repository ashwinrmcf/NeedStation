import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { healthCheckupData } from '../../data/ServiceData/HealthCheckupData';

const HealthCheckupOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={healthCheckupData.serviceName}
      serviceDescription={healthCheckupData.serviceDescription}
      serviceHighlight={healthCheckupData.serviceHighlight}
      services={healthCheckupData.services}
      trustIndicators={healthCheckupData.trustIndicators}
      detailedInfo={healthCheckupData.detailedInfo}
    />
  );
};

export default HealthCheckupOptions;
