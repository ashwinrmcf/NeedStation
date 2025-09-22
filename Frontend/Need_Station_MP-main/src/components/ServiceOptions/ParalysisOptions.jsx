import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { paralysisData } from '../../data/ServiceData/ParalysisData';

const ParalysisOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={paralysisData.serviceName}
      serviceDescription={paralysisData.serviceDescription}
      serviceHighlight={paralysisData.serviceHighlight}
      services={paralysisData.services}
      trustIndicators={paralysisData.trustIndicators}
      detailedInfo={paralysisData.detailedInfo}
    />
  );
};

export default ParalysisOptions;
