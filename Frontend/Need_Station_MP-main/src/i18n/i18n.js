import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Dashboard
      "overview": "Overview",
      "todaysTasks": "Today's Tasks",
      "noTasksToday": "No tasks for today",
      "time": "Time",
      "tasksThisWeek": "Tasks This Week",
      "monthlyEarnings": "Monthly Earnings",
      "yourRating": "Your Rating",
      "newMessages": "New Messages",
      "loading": "Loading...",
      "showWelcomeCard": "Show Welcome Card",
      "myTasks": "My Tasks",
      "customer": "Customer",
      "newRequest": "New Request - Action Required",
      "accepted": "Accepted - Ready to Start",
      "noTasksAvailable": "No tasks available at the moment",
      "allTasks": "All Tasks",
      "upcomingTasks": "Upcoming Tasks",
      "completedTasks": "Completed Tasks",
      "newRequestShort": "New Request",
      "acceptedShort": "Accepted",
      "inProgress": "In Progress",
      "completed": "Completed",
      "cancelled": "Cancelled",
      "searchTasks": "Search tasks...",
      "noTasksFound": "No tasks found",
      "viewDetails": "View Details",
      "accept": "Accept",
      "reject": "Reject",
      "startTask": "Start Task",
      "completeTaskBtn": "Complete Task",
      "contactCustomer": "Contact Customer",
      
      // Quick Actions
      "quickActions": "Quick Actions",
      "markLocation": "Mark Location",
      "callSupport": "Call Support", 
      "completeTask": "Complete Task",
      "reportIssue": "Report Issue",
      
      // Health Safety
      "healthSafetyReminders": "Health Safety Reminders",
      "washHands": "Remember to wash hands",
      "wearMask": "Wear mask during visits",
      "checkPatient": "Check patient vitals",
      "medicineTime": "Remember medicine timing",
      
      // Emergency
      "emergencyContacts": "Emergency Contacts",
      "ambulance": "Ambulance",
      "police": "Police",
      
      // Services
      "elderlycare": "Elderly Care",
      "newMotherSupport": "New Mother Support",
      "diabetesCheck": "Diabetes Check",
      "parkinsonscare": "Parkinson's Care",
      "bedriddencare": "Bedridden Patient Care",
      "motherBabyCare": "Mother and Baby Care",
      "paralysiscare": "Paralysis Care",
      "nursingcare": "Nursing Care",
      "pathologycare": "Pathology Care",
      "diabetesManagement": "Diabetes Management",
      "healthCheckup": "Health Check-up Services",
      "physiotherapy": "Physiotherapy",
      "postSurgeryCare": "Post Surgery Care",
      "caretakerAtHome": "Caretaker at Home",
      "homeSecurityGuard": "Home Security Guard"
    }
  },
  hi: {
    translation: {
      // Dashboard
      "overview": "अवलोकन",
      "todaysTasks": "आज के काम",
      "noTasksToday": "आज कोई काम नहीं है",
      "time": "समय",
      "tasksThisWeek": "इस सप्ताह के कार्य",
      "monthlyEarnings": "मासिक कमाई",
      "yourRating": "आपकी रेटिंग",
      "newMessages": "नए संदेश",
      "loading": "लोड हो रहा है...",
      "showWelcomeCard": "स्वागत कार्ड दिखाएं",
      "myTasks": "मेरे कार्य",
      "customer": "ग्राहक",
      "newRequest": "नया अनुरोध - कार्रवाई आवश्यक",
      "accepted": "स्वीकृत - शुरू करने के लिए तैयार",
      "noTasksAvailable": "इस समय कोई कार्य उपलब्ध नहीं है",
      "allTasks": "सभी कार्य",
      "upcomingTasks": "आगामी कार्य",
      "completedTasks": "पूर्ण कार्य",
      "newRequestShort": "नया अनुरोध",
      "acceptedShort": "स्वीकृत",
      "inProgress": "प्रगति में",
      "completed": "पूर्ण",
      "cancelled": "रद्द",
      "searchTasks": "कार्य खोजें...",
      "noTasksFound": "कोई कार्य नहीं मिला",
      "viewDetails": "विवरण देखें",
      "accept": "स्वीकार करें",
      "reject": "अस्वीकार करें",
      "startTask": "कार्य शुरू करें",
      "completeTaskBtn": "कार्य पूर्ण करें",
      "contactCustomer": "ग्राहक से संपर्क करें",
      
      // Quick Actions
      "quickActions": "त्वरित कार्य",
      "markLocation": "स्थान चिह्नित करें",
      "callSupport": "सहायता कॉल",
      "completeTask": "काम पूरा",
      "reportIssue": "समस्या रिपोर्ट",
      
      // Health Safety
      "healthSafetyReminders": "स्वास्थ्य सुरक्षा याददाश्त",
      "washHands": "हाथ साफ करना याद रखें",
      "wearMask": "मास्क पहनें",
      "checkPatient": "मरीज़ की जाँच करें",
      "medicineTime": "दवा का समय याद रखें",
      
      // Emergency
      "emergencyContacts": "आपातकालीन संपर्क",
      "ambulance": "एम्बुलेंस",
      "police": "पुलिस",
      
      // Services
      "elderlycare": "बुजुर्गों की देखभाल",
      "newMotherSupport": "नई माँ सहायता",
      "diabetesCheck": "मधुमेह जाँच",
      "parkinsonscare": "पार्किंसन देखभाल",
      "bedriddencare": "बिस्तर पर पड़े मरीज़ की देखभाल",
      "motherBabyCare": "माँ और बच्चे की देखभाल",
      "paralysiscare": "लकवा देखभाल",
      "nursingcare": "नर्सिंग देखभाल",
      "pathologycare": "पैथोलॉजी देखभाल",
      "diabetesManagement": "मधुमेह प्रबंधन",
      "healthCheckup": "स्वास्थ्य जाँच सेवाएं",
      "physiotherapy": "फिजियोथेरेपी",
      "postSurgeryCare": "सर्जरी के बाद देखभाल",
      "caretakerAtHome": "घर पर देखभालकर्ता",
      "homeSecurityGuard": "घर सुरक्षा गार्ड"
    }
  },
  kn: {
    translation: {
      // Dashboard
      "overview": "ಅವಲೋಕನ",
      "todaysTasks": "ಇಂದಿನ ಕೆಲಸಗಳು",
      "noTasksToday": "ಇಂದು ಯಾವುದೇ ಕೆಲಸ ಇಲ್ಲ",
      "time": "ಸಮಯ",
      "tasksThisWeek": "ಈ ವಾರದ ಕೆಲಸಗಳು",
      "monthlyEarnings": "ಈ ತಿಂಗಳ ಆದಾಯ",
      "yourRating": "ನಿಮ್ಮ ರೇಟಿಂಗ್",
      "newMessages": "ಹೊಸ ಸಂದೇಶಗಳು",
      
      // Quick Actions
      "quickActions": "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      "markLocation": "ಸ್ಥಳ ಗುರುತಿಸಿ",
      "callSupport": "ಸಹಾಯ ಕರೆ",
      "completeTask": "ಕೆಲಸ ಪೂರ್ಣಗೊಳಿಸಿ",
      "reportIssue": "ಸಮಸ್ಯೆ ವರದಿ",
      
      // Health Safety
      "healthSafetyReminders": "ಆರೋಗ್ಯ ಸುರಕ್ಷತೆ ಜ್ಞಾಪನೆಗಳು",
      "washHands": "ಕೈ ತೊಳೆಯುವುದನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ",
      "wearMask": "ಮುಖವಾಡ ಧರಿಸಿ",
      "checkPatient": "ರೋಗಿಯ ಪರೀಕ್ಷೆ ಮಾಡಿ",
      "medicineTime": "ಔಷಧದ ಸಮಯ ನೆನಪಿಸಿಕೊಳ್ಳಿ",
      
      // Emergency
      "emergencyContacts": "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
      "ambulance": "ಆಂಬುಲೆನ್ಸ್",
      "police": "ಪೊಲೀಸ್",
      
      // Services - keeping English for now, can be translated later
      "elderlycare": "Elderly Care",
      "newMotherSupport": "New Mother Support",
      "diabetesCheck": "Diabetes Check"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false
    },
    
    // Store language preference in localStorage
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
