import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { physiotherapyData } from '../../data/ServiceData/PhysiotherapyData';

const PhysiotherapyOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={physiotherapyData.serviceName}
      serviceDescription={physiotherapyData.serviceDescription}
      serviceHighlight={physiotherapyData.serviceHighlight}
      services={physiotherapyData.services}
      trustIndicators={physiotherapyData.trustIndicators}
      detailedInfo={physiotherapyData.detailedInfo}
    />
  );
};

export default PhysiotherapyOptions;
