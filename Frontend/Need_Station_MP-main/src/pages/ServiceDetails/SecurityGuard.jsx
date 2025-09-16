import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import AvailableServices from "../../components/ElderCareAvailableServices/AvailableServices.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";
// import GetStarted from "../../components/GetStarted/GetStarted.jsx";

const SecurityGuard = () => {

  const serviceData = ServicesData.find((service) => service.id === 1);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <AvailableServices currentServiceId={1}/>
    <HowItWorks/>
    {/* <GetStarted/> */}
  </>
}

export default SecurityGuard;