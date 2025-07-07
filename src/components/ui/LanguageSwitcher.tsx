import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../ClientProviders';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);

  return (
    <div className="flex gap-2">
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded ${i18n.language === 'nl' ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('nl')}
      >
        NL
      </button>
    </div>
  );
}; 