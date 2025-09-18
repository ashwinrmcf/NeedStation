import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import MotherBabyOptions from "../../components/ServiceOptions/MotherBabyOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const MotherBabyCare = () => {

  const serviceData = ServicesData.find((service) => service.id === 4);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <MotherBabyOptions/>
    <HowItWorks/>
  </>
}

export default MotherBabyCare;
