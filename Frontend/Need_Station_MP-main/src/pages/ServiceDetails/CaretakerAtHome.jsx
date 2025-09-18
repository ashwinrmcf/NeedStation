import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import CaretakerOptions from "../../components/ServiceOptions/CaretakerOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const CaretakerAtHome = () => {

  const serviceData = ServicesData.find((service) => service.id === 13);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <CaretakerOptions/>
    <HowItWorks/>
  </>
}

export default CaretakerAtHome;
