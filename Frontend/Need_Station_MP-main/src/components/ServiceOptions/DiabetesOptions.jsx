import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { diabetesData } from '../../data/ServiceData/DiabetesData';

const DiabetesOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={diabetesData.serviceName}
      serviceDescription={diabetesData.serviceDescription}
      serviceHighlight={diabetesData.serviceHighlight}
      services={diabetesData.services}
      trustIndicators={diabetesData.trustIndicators}
      detailedInfo={diabetesData.detailedInfo}
    />
  );
};

export default DiabetesOptions;
