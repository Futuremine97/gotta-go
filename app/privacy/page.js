"use client";

import { useLang } from "../i18n/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLang();
  return (
    <main className="container" style={{ maxWidth: 760 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>{t("p.title")}</h1>
      <p className="section-sub">{t("p.effective")}</p>

      <div className="card" style={{ lineHeight: 1.8 }}>
        <p>{t("p.intro")}</p>

        <h3>{t("p.h1")}</h3>
        <p>{t("p.b1")}</p>

        <h3>{t("p.h2")}</h3>
        <p>{t("p.b2")}</p>

        <h3>{t("p.h3")}</h3>
        <p>{t("p.b3")}</p>

        <h3>{t("p.h4")}</h3>
        <p>{t("p.b4")}</p>

        <h3>{t("p.h5")}</h3>
        <p>{t("p.b5")}</p>

        <h3>{t("p.h6")}</h3>
        <p>{t("p.b6")}</p>

        <h3>{t("p.h7")}</h3>
        <p>{t("p.b7")}</p>

        <h3>{t("p.h8")}</h3>
        <p>{t("p.b8")} <b>futuremine97@gmail.com</b></p>

        <p className="muted small" style={{ marginTop: 20 }}>{t("p.note")}</p>
      </div>
    </main>
  );
}
