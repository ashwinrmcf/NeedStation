import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import DiabetesOptions from "../../components/ServiceOptions/DiabetesOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const DiabetesManagement = () => {

  const serviceData = ServicesData.find((service) => service.id === 9);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <DiabetesOptions/>
    <HowItWorks/>
  </>
}

export default DiabetesManagement;
