import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import AvailableServices from "../../components/ElderCareAvailableServices/AvailableServices.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const ElderlyCareNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 6);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <AvailableServices currentServiceId={6}/>
    <HowItWorks/>
  </>
}

export default ElderlyCareNew;
