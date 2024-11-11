// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to our website!",
      "description": "This is the English version."
    }
  },
  vi: {
    translation: {
      "welcome": "Chào mừng đến với trang web của chúng tôi!",
      "description": "Đây là phiên bản tiếng Việt."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Ngôn ngữ mặc định
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
