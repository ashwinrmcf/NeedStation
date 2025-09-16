import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import AvailableServices from "../../components/ElderCareAvailableServices/AvailableServices.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const ParkinsonsCare = () => {

  const serviceData = ServicesData.find((service) => service.id === 2);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <AvailableServices currentServiceId={2}/>
    <HowItWorks/>
  </>
}

export default ParkinsonsCare;
