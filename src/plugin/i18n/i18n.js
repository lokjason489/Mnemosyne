
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN from './locales/en.json';
import TC from './locales/tc.json';
import SC from './locales/sc.json';

const resources = {
    en: {
        translation: EN
    },
    sc: {
        translation: SC
    },
    tc: {
        translation: TC
    }
};

i18n.use(initReactI18next).init({
resources,
lng: 'tc',
fallbackLng: 'tc',
interpolation: { escapeValue: false },
});

export default i18n;