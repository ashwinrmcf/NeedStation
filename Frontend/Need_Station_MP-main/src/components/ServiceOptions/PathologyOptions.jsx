import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { pathologyData } from '../../data/ServiceData/PathologyData';

const PathologyOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={pathologyData.serviceName}
      serviceDescription={pathologyData.serviceDescription}
      serviceHighlight={pathologyData.serviceHighlight}
      services={pathologyData.services}
      trustIndicators={pathologyData.trustIndicators}
      detailedInfo={pathologyData.detailedInfo}
    />
  );
};

export default PathologyOptions;
