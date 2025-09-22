import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { bedriddenCareData } from '../../data/ServiceData/BedriddenCareData';

const BedriddenPatientOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={bedriddenCareData.serviceName}
      serviceDescription={bedriddenCareData.serviceDescription}
      serviceHighlight={bedriddenCareData.serviceHighlight}
      services={bedriddenCareData.services}
      trustIndicators={bedriddenCareData.trustIndicators}
      detailedInfo={bedriddenCareData.detailedInfo}
    />
  );
};

export default BedriddenPatientOptions;
