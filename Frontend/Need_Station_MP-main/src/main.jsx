import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./routes/App.jsx";
import HindiApp from "./routes/HindiApp.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/HomePage/Home.jsx";
import BasicNeedsHome from "./pages/BasicNeeds/BasicNeedsHome.jsx";
import Login from "./pages/LoginPage/Login.jsx";
import Signup from "./pages/SignupPage/Signup.jsx";
import WorkerLogin from "./pages/WorkerLogin/WorkerLogin.jsx";
import MaidServicesHome from "./pages/MaidServices/MaidServicesHome.jsx";
import Electrician from "./pages/BasicNeeds/Electrician.jsx";
import Plumber from "./pages/BasicNeeds/Plumber.jsx";
import WaterSupply from "./pages/BasicNeeds/WaterSupply.jsx";
import BabySitter from "./pages/ElderCare/BabySitter.jsx";
import CareTaker from "./pages/ElderCare/CareTaker.jsx";
import Nurse from "./pages/ElderCare/Nurse.jsx";
import ParalysisCare from "./pages/ElderCare/ParalysisCare.jsx";
import PostnatalCare from "./pages/ElderCare/PostnatalCare.jsx";
import HealthCheckup from "./pages/ElderCare/HealthCheckup.jsx";
import BasicNeedsServiceUserDescription from "./pages/BasicNeeds/BasicNeedsServiceUserDescription.jsx";
import TestRouterContext from "./test/TestRouterContext.jsx";
import PaymentGateway from "./pages/PaymentGateway/PaymentGateway.jsx";
import AvailableHelpers from "./pages/BasicNeeds/AvailableHelpers.jsx";
import HelperRegistration from "./pages/WorkerRegistration/WorkerRegistration.jsx";
import WorkerDashboard from "./pages/WorkerDashboard/WorkerDashboard.jsx";
import HelperLayout from "./components/layouts/HelperLayout.jsx";
import OverviewPage from "./pages/HelperPages/OverviewPage.jsx";
import UpcomingTaskPage from "./pages/HelperPages/UpcomingTasksPage";
import CompletedTaskPage from "./pages/HelperPages/CompletedTaskPage";
import SettingsPage from "./pages/HelperPages/SettingsPage";
import EarningPage from "./pages/HelperPages/EarningAndPaymentPage";
import ContactUs from "./pages/ContactUs/ContactUs.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import TranslationCenter from "./pages/TranslationCenter/TranslationCenter.jsx";
import TermsAndServices from "./pages/TermsAndServices/TermsAndServices.jsx";
import WhyBecomeHelper from "./pages/WhyBecomeHelper/WhyBecomeHelper.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import HowItWorks from "./pages/HowItWorks/HowItWorks.jsx";
import FAQ from "./pages/FAQ/FAQ.jsx";
import Cart from "./pages/Cart/Cart.jsx";

// Hindi components
import HindiHome from "./pages/Hindi/Home.jsx";
import HindiAboutUs from "./pages/Hindi/AboutUs.jsx";
import HindiLogin from "./pages/Hindi/Login.jsx";
import HindiSignup from "./pages/Hindi/Signup.jsx";
import HindiWorkerLogin from "./pages/Hindi/WorkerLogin.jsx";
import HindiContactUs from "./pages/Hindi/ContactUs.jsx";
import HindiHowItWorks from "./pages/Hindi/HowItWorks.jsx";
import HindiFAQ from "./pages/Hindi/FAQ.jsx";
import HindiPrivacyPolicy from "./pages/Hindi/PrivacyPolicy.jsx";
import HindiTermsAndServices from "./pages/Hindi/TermsAndServices.jsx";


const router = createBrowserRouter([
  // English routes
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/basic-needs-home", element: <BasicNeedsHome /> },
      { path: "/why-become-helper", element: <WhyBecomeHelper /> },
      { path: "/maid-services", element: <MaidServicesHome/>},
      { path: "/electrician", element: <Electrician /> },
      { path: "/plumber", element: <Plumber /> },
      { path: "/water-supply", element: <WaterSupply /> },
      { path: "/babysitter", element: <BabySitter /> },
      { path: "/caretaker", element: <CareTaker /> },
      { path: "/nurse", element: <Nurse /> },
      { path: "/paralysis-care", element: <ParalysisCare /> },
      { path: "/postnatal-care", element: <PostnatalCare /> },
      { path: "/health-checkup", element: <HealthCheckup /> },
      {path: "/helper-registration", element: <HelperRegistration/>},
      {path: "/worker-registration", element: <HelperRegistration/>},
      {path: "/contact-us", element: <ContactUs/>},
      {path: "/about-us", element: <AboutUs/>},
      {path: "/how-it-works", element: <HowItWorks/>},
      {path: "/faq", element: <FAQ/>},
      {path: "/language-settings", element: <TranslationCenter/>},
      {path: "/terms-and-services", element: <TermsAndServices/>},
      {path: "/privacy-policy", element: <PrivacyPolicy/>},
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/worker-login", element: <WorkerLogin /> },
  { path: "/worker-dashboard", element: <WorkerDashboard /> },
  {
    path: "/user-details",
    element: <BasicNeedsServiceUserDescription />,
  },
  { path: "/payment-gateway", element: <PaymentGateway /> },
  { path: "/available-helpers", element: <AvailableHelpers /> },
  { path: "/cart", element: <Cart /> },
  {
    path: "/helper",
    element: <HelperLayout />,
    children: [
      { path: "overview", element: <OverviewPage /> },
      { path: "upcoming-tasks", element: <UpcomingTaskPage /> },
      { path: "completed-task", element: <CompletedTaskPage /> },
      { path: "earnings", element: <EarningPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  // Hindi routes under /hi path
  {
    path: "hi",
    element: <HindiApp />,
    children: [
      { path: "", element: <HindiHome /> },
      { path: "language-settings", element: <TranslationCenter /> },
      { path: "about-us", element: <HindiAboutUs /> },
      { path: "contact-us", element: <HindiContactUs /> },
      { path: "how-it-works", element: <HindiHowItWorks /> },
      { path: "faq", element: <HindiFAQ /> },
      { path: "privacy-policy", element: <HindiPrivacyPolicy /> },
      { path: "terms-and-services", element: <HindiTermsAndServices /> },
    ],
  },

  // Standalone Hindi auth pages (without header/footer)
  { path: "/hi/login", element: <HindiLogin /> },
  { path: "/hi/signup", element: <HindiSignup /> },
  { path: "/hi/worker-login", element: <HindiWorkerLogin /> },
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
