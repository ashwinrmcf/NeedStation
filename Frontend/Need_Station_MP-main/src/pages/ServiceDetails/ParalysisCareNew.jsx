import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import ParalysisOptions from "../../components/ServiceOptions/ParalysisOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const ParalysisCareNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 5);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <ParalysisOptions/>
    <HowItWorks/>
  </>
}

export default ParalysisCareNew;
