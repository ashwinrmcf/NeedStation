import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { parkinsonsData } from '../../data/ServiceData/ParkinsonsData';

const ParkinsonsOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={parkinsonsData.serviceName}
      serviceDescription={parkinsonsData.serviceDescription}
      serviceHighlight={parkinsonsData.serviceHighlight}
      services={parkinsonsData.services}
      trustIndicators={parkinsonsData.trustIndicators}
      detailedInfo={parkinsonsData.detailedInfo}
    />
  );
};

export default ParkinsonsOptions;
