"use client";

import Link from "next/link";
import { useLang } from "../i18n/LanguageContext";

export default function Disclaimer() {
  const { t } = useLang();
  return (
    <div className="disclaimer">
      <strong>{t("disc.title")}</strong>
      <p>
        {t("disc.body")}{" "}
        <Link href="/privacy" style={{ textDecoration: "underline" }}>{t("disc.privacyLink")}</Link>
        {t("disc.privacySuffix")}
      </p>
    </div>
  );
}
