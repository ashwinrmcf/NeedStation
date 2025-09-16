import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import AvailableServices from "../../components/ElderCareAvailableServices/AvailableServices.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const HealthCheckupNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 10);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <AvailableServices currentServiceId={10}/>
    <HowItWorks/>
  </>
}

export default HealthCheckupNew;
