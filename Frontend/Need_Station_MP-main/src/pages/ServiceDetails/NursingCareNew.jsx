import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import NursingCareOptions from "../../components/ServiceOptions/NursingCareOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const NursingCareNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 7);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <NursingCareOptions/>
    <HowItWorks/>
  </>
}

export default NursingCareNew;
