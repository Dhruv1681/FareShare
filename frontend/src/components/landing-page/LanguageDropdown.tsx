import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageDropdown = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", flagIcon: "flag-us", languageName: "English" },
    { code: "fr", flagIcon: "flag-fr", languageName: "Français" },
    { code: "sp", flagIcon: "flag-sp", languageName: "Español" },
    { code: "de", flagIcon: "flag-de", languageName: "Deutsch" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const languageChange = (language: any) => {
		setSelectedLanguage(language);
		i18n.changeLanguage(language.code);
	}

  return (
    <div className="dropdown hoverable d-inline-block mr-4">
      <div
        className="dropdown-toggle font-bold d-flex align-items-center text-black"
        data-toggle="dropdown"
      >
        <div className={`icon-flag icon-${selectedLanguage.flagIcon}`}></div>
        <div className="ml-2">{selectedLanguage.languageName}</div>
      </div>

      <div className="dropdown-menu p-0">
        {languages.map((language, index) => (
          <div
            key={index}
            className="d-flex d-flex align-items-center hover-green p-2"
            onClick={() => languageChange(language)}
          >
            <div
              className={`icon-flag icon-${language.flagIcon} d-inline-block`}
            ></div>

            <div className="ml-2 d-inline-block font-bold">
              {language.languageName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageDropdown;