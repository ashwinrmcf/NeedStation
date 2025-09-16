import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import AvailableServices from "../../components/ElderCareAvailableServices/AvailableServices.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const PhysiotherapyNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 11);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <AvailableServices currentServiceId={11}/>
    <HowItWorks/>
  </>
}

export default PhysiotherapyNew;
