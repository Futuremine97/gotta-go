"use client";

import Link from "next/link";
import { useLang } from "../i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Nav() {
  const { t } = useLang();
  return (
    <nav className="nav">
      <Link href="/" className="logo">잘<span>러</span> · JALR</Link>
      <div className="links">
        <Link href="/guides">{t("nav.guides")}</Link>
        <Link href="/trip">{t("nav.trip")}</Link>
        <Link href="/quick-help">{t("nav.quickHelp")}</Link>
        <Link href="/language">{t("nav.language")}</Link>
        <Link href="/become-guide">{t("nav.becomeGuide")}</Link>
      </div>
      <LanguageSwitcher />
    </nav>
  );
}
