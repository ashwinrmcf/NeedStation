import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import ParkinsonsOptions from "../../components/ServiceOptions/ParkinsonsOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const ParkinsonsCare = () => {

  const serviceData = ServicesData.find((service) => service.id === 2);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <ParkinsonsOptions/>
    <HowItWorks/>
  </>
}

export default ParkinsonsCare;
