import { createContext, useContext } from 'react';

const LanguageContext = createContext('en');

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children, language = 'en' }) => {
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
};
