import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { elderCareData } from '../../data/ServiceData/ElderCareData';

const ElderlyCareOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={elderCareData.serviceName}
      serviceDescription={elderCareData.serviceDescription}
      serviceHighlight={elderCareData.serviceHighlight}
      services={elderCareData.services}
      trustIndicators={elderCareData.trustIndicators}
      detailedInfo={elderCareData.detailedInfo}
    />
  );
};

export default ElderlyCareOptions;
