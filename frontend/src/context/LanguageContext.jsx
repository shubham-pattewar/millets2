import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    home: 'Home',
    marketplace: 'Marketplace',
    dashboard: 'Dashboard',
    products: 'Products',
    cart: 'Cart',
    wishlist: 'Wishlist',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    price: 'Price',
    quantity: 'Quantity',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    verified: 'Verified',
    rating: 'Rating',
    reviews: 'Reviews',
    myProducts: 'My Products',
    totalEarnings: 'Total Earnings',
    totalOrders: 'Total Orders',
    pendingOrders: 'Pending Orders',
    uploadProduct: 'Upload Product',
    benefits: 'Benefits',
    recipes: 'Recipes',
    quiz: 'Quiz',
    learnMore: 'Learn More',
    welcome: 'Welcome',
    about: 'About',
    contact: 'Contact',
    viewAll: 'View All',
    checkout: 'Checkout',
    placeOrder: 'Place Order',
    orderHistory: 'Order History',
    notifications: 'Notifications',
    settings: 'Settings',
    help: 'Help'
  },
  hi: {
    home: 'होम',
    marketplace: 'बाजार',
    dashboard: 'डैशबोर्ड',
    products: 'उत्पाद',
    cart: 'कार्ट',
    wishlist: 'इच्छा सूची',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    signup: 'साइन अप',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    sort: 'क्रमबद्ध करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    dontHaveAccount: 'खाता नहीं है?',
    alreadyHaveAccount: 'पहले से खाता है?',
    addToCart: 'कार्ट में जोड़ें',
    buyNow: 'अभी खरीदें',
    price: 'कीमत',
    quantity: 'मात्रा',
    inStock: 'स्टॉक में',
    outOfStock: 'स्टॉक में नहीं',
    verified: 'सत्यापित',
    rating: 'रेटिंग',
    reviews: 'समीक्षाएं',
    myProducts: 'मेरे उत्पाद',
    totalEarnings: 'कुल कमाई',
    totalOrders: 'कुल ऑर्डर',
    pendingOrders: 'लंबित ऑर्डर',
    uploadProduct: 'उत्पाद अपलोड करें',
    benefits: 'लाभ',
    recipes: 'व्यंजन',
    quiz: 'प्रश्नोত্তरी',
    learnMore: 'और जानें',
    welcome: 'स्वागत है',
    about: 'के बारे में',
    contact: 'संपर्क करें',
    viewAll: 'सभी देखें',
    checkout: 'चेकआउट',
    placeOrder: 'ऑर्डर करें',
    orderHistory: 'ऑर्डर इतिहास',
    notifications: 'सूचनाएं',
    settings: 'सेटिंग्स',
    help: 'मदद'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
    ]
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
