export class LanguageService {
  static getPreferredLanguage(): string {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('preferred_language');
      if (storedLang) return storedLang;
      let browserLang = 'en';
      if (navigator.language && typeof navigator.language === 'string') {
        const splitLang = navigator.language.split('-');
        browserLang = splitLang && splitLang[0] ? splitLang[0] : 'en';
      }
      if (['en', 'nl'].includes(browserLang)) return browserLang;
    }
    return 'en';
  }

  static setPreferredLanguage(lang: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_language', lang);
    }
  }
} 