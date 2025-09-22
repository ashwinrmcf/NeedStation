import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { nursingCareData } from '../../data/ServiceData/NursingCareData';

const NursingCareOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={nursingCareData.serviceName}
      serviceDescription={nursingCareData.serviceDescription}
      serviceHighlight={nursingCareData.serviceHighlight}
      services={nursingCareData.services}
      trustIndicators={nursingCareData.trustIndicators}
      detailedInfo={nursingCareData.detailedInfo}
    />
  );
};

export default NursingCareOptions;
