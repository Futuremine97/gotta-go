"use client";

import { useLang } from "../i18n/LanguageContext";
import { LOCALES } from "../i18n/strings";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLang();
  return (
    <select
      className="lang-switcher"
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      aria-label="Language"
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag} {l.label}
        </option>
      ))}
    </select>
  );
}
