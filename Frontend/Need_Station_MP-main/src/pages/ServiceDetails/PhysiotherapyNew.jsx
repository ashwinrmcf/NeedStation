import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import PhysiotherapyOptions from "../../components/ServiceOptions/PhysiotherapyOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const PhysiotherapyNew = () => {

  const serviceData = ServicesData.find((service) => service.id === 11);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <PhysiotherapyOptions/>
    <HowItWorks/>
  </>
}

export default PhysiotherapyNew;
