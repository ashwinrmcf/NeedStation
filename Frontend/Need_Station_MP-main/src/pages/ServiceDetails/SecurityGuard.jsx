import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import SecurityGuardOptions from "../../components/ServiceOptions/SecurityGuardOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";
// import GetStarted from "../../components/GetStarted/GetStarted.jsx";

const SecurityGuard = () => {

  const serviceData = ServicesData.find((service) => service.id === 1);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <SecurityGuardOptions/>
    <HowItWorks/>
    {/* <GetStarted/> */}
  </>
}

export default SecurityGuard;