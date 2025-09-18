import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import PathologyOptions from "../../components/ServiceOptions/PathologyOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const PathologyCare = () => {

  const serviceData = ServicesData.find((service) => service.id === 8);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <PathologyOptions/>
    <HowItWorks/>
  </>
}

export default PathologyCare;
