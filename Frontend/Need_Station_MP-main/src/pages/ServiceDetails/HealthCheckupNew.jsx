import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import HealthCheckupOptions from "../../components/ServiceOptions/HealthCheckupOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const HealthCheckupNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 10);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <HealthCheckupOptions/>
    <HowItWorks/>
  </>
}

export default HealthCheckupNew;
