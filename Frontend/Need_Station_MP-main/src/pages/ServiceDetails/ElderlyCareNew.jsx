import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import ElderlyCareOptions from "../../components/ServiceOptions/ElderlyCareOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const ElderlyCareNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 6);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <ElderlyCareOptions/>
    <HowItWorks/>
  </>
}

export default ElderlyCareNew;
