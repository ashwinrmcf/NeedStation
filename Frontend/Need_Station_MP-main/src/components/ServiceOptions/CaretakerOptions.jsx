import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { caretakerData } from '../../data/ServiceData/CaretakerData';

const CaretakerOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={caretakerData.serviceName}
      serviceDescription={caretakerData.serviceDescription}
      serviceHighlight={caretakerData.serviceHighlight}
      services={caretakerData.services}
      trustIndicators={caretakerData.trustIndicators}
      detailedInfo={caretakerData.detailedInfo}
    />
  );
};

export default CaretakerOptions;
