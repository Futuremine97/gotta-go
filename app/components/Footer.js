"use client";

import Link from "next/link";
import { useLang } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer>
      {t("footer.tagline")} · MVP
      <br />
      <Link href="/privacy">{t("footer.privacy")}</Link> · {t("footer.legal")}
    </footer>
  );
}
