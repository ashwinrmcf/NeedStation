import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { motherBabyData } from '../../data/ServiceData/MotherBabyData';

const MotherBabyOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={motherBabyData.serviceName}
      serviceDescription={motherBabyData.serviceDescription}
      serviceHighlight={motherBabyData.serviceHighlight}
      services={motherBabyData.services}
      trustIndicators={motherBabyData.trustIndicators}
      detailedInfo={motherBabyData.detailedInfo}
    />
  );
};

export default MotherBabyOptions;
