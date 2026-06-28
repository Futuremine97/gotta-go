"use client";

import Link from "next/link";
import Disclaimer from "./components/Disclaimer";
import { useLang } from "./i18n/LanguageContext";

export default function Home() {
  const { t } = useLang();
  return (
    <main className="container">
      <section className="hero">
        <h1>{t("home.heroTitle1")}<br />{t("home.heroTitle2")}</h1>
        <p>{t("home.heroDesc")}</p>
        <div className="cta">
          <Link href="/guides" className="btn btn-primary">{t("home.ctaFind")}</Link>
          <Link href="/become-guide" className="btn btn-ghost">{t("home.ctaBecome")}</Link>
        </div>
      </section>

      <h2 className="section-title">{t("home.diffTitle")}</h2>
      <p className="section-sub">{t("home.diffSub")}</p>
      <div className="grid grid-2">
        <div className="card"><h3>{t("home.f1t")}</h3><p className="muted">{t("home.f1d")}</p></div>
        <div className="card"><h3>{t("home.f2t")}</h3><p className="muted">{t("home.f2d")}</p></div>
        <div className="card"><h3>{t("home.f3t")}</h3><p className="muted">{t("home.f3d")}</p></div>
        <div className="card"><h3>{t("home.f4t")}</h3><p className="muted">{t("home.f4d")}</p></div>
      </div>

      <h2 className="section-title">{t("home.startTitle")}</h2>
      <p className="section-sub">{t("home.startSub")}</p>
      <div className="card">
        <div className="step"><div className="num">1</div><div><strong>{t("home.s1t")}</strong><div className="muted small">{t("home.s1d")}</div></div></div>
        <div className="step"><div className="num">2</div><div><strong>{t("home.s2t")}</strong><div className="muted small">{t("home.s2d")}</div></div></div>
        <div className="step"><div className="num">3</div><div><strong>{t("home.s3t")}</strong><div className="muted small">{t("home.s3d")}</div></div></div>
        <Link href="/trip" className="btn btn-dark btn-block" style={{ marginTop: 8 }}>{t("home.startBtn")}</Link>
      </div>

      <Disclaimer />
    </main>
  );
}
