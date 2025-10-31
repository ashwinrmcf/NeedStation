import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../hooks/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import NeedBot from '../components/NeedBot';
import { BookingModalProvider } from '../components/BookingModal/BookingModalProvider';
import { CartProvider } from '../store/CartContext';
import MobileBackButton from '../components/MobileBackButton/MobileBackButton';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function HindiApp() {
  const location = useLocation();
  
  // Hide header/footer for login and signup pages
  const hideHeaderFooter = location.pathname === '/hi/login' || 
                           location.pathname === '/hi/signup' ||
                           location.pathname === '/hi/worker-login';
  
  return (
    <LanguageProvider language="hi">
      <CartProvider>
        <BookingModalProvider>
          <ScrollToTop />
          {!hideHeaderFooter && <Header />}
          {!hideHeaderFooter && <MobileBackButton />}
          <Outlet />
          {!hideHeaderFooter && <Footer />}
          {!hideHeaderFooter && <NeedBot />}
          <ToastContainer />
        </BookingModalProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
