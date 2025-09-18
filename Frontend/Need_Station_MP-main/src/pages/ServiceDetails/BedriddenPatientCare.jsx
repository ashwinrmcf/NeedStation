import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import BedriddenPatientOptions from "../../components/ServiceOptions/BedriddenPatientOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const BedriddenPatientCare = () => {

  const serviceData = ServicesData.find((service) => service.id === 3);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <BedriddenPatientOptions/>
    <HowItWorks/>
  </>
}

export default BedriddenPatientCare;
