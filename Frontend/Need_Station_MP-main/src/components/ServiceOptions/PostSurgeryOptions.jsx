import React from 'react';
import GenericServiceOptions from './GenericServiceOptions';
import { postSurgeryData } from '../../data/ServiceData/PostSurgeryData';

const PostSurgeryOptions = () => {
  return (
    <GenericServiceOptions 
      serviceName={postSurgeryData.serviceName}
      serviceDescription={postSurgeryData.serviceDescription}
      serviceHighlight={postSurgeryData.serviceHighlight}
      services={postSurgeryData.services}
      trustIndicators={postSurgeryData.trustIndicators}
      detailedInfo={postSurgeryData.detailedInfo}
    />
  );
};

export default PostSurgeryOptions;
