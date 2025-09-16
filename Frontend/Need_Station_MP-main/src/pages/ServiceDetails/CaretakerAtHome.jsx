import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import AvailableServices from "../../components/ElderCareAvailableServices/AvailableServices.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const CaretakerAtHome = () => {

  const serviceData = ServicesData.find((service) => service.id === 13);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <AvailableServices currentServiceId={13}/>
    <HowItWorks/>
  </>
}

export default CaretakerAtHome;
