import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationEnglish from "./locales/en/translations.json";
import translationFrench from "./locales/fr/translations.json";
import translationSpanish from "./locales/sp/translations.json";
import translationGerman from "./locales/de/translations.json";

const resources = {
  en: {
    translation: translationEnglish,
  },
  sp: {
    translation: translationSpanish,
  },
  fr: {
    translation: translationFrench,
  },
  de: {
    translation: translationGerman,
  },
};

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    debug: true,
    ns: ["translation"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
