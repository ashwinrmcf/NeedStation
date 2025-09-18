import ElderCareServiceDetails from "../../components/ElderCareServiceDetails/ElderCareServiceDetails";
import ServicesData from "../../data/Services/Services.js";
import PostSurgeryOptions from "../../components/ServiceOptions/PostSurgeryOptions.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

const PostSurgeryCare = () => {

  const serviceData = ServicesData.find((service) => service.id === 12);

  return <>
    <ElderCareServiceDetails data = {serviceData} />
    <PostSurgeryOptions/>
    <HowItWorks/>
  </>
}

export default PostSurgeryCare;
