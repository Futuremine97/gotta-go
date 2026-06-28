"use client";

import { useLang } from "../i18n/LanguageContext";

export default function GuideCard({ guide, action }) {
  const { t } = useLang();
  const name = guide.user?.name || "가이드";
  const initial = name.slice(0, 1);
  const neighborhoods = (guide.neighborhoods || "").split(",").filter(Boolean);
  const languages = (guide.languages || "").split(",").filter(Boolean);
  const interests = (guide.interests || "").split(",").filter(Boolean);

  return (
    <div className="card guide-card">
      <div className="top">
        <div className="avatar">{initial}</div>
        <div>
          <h3 style={{ margin: 0 }}>{name}</h3>
          <div className="small muted">
            {guide.isLocal ? t("card.local") : t("card.pro")} ·{" "}
            {guide.priceType === "free" ? t("c.free") : t("c.paid")}
            {guide.priceType === "paid" && guide.certNo ? (
              <span className="chip green" style={{ marginLeft: 6 }}>{t("card.certified")}</span>
            ) : null}
          </div>
        </div>
        <div className="rating">★ {Number(guide.rating).toFixed(1)}</div>
      </div>

      <p className="muted small" style={{ marginTop: 12 }}>{guide.bio}</p>

      <div style={{ marginTop: 8 }}>
        {neighborhoods.map((n) => (
          <span key={n} className="chip brand">📍 {n}</span>
        ))}
      </div>
      <div>
        {languages.map((l) => (
          <span key={l} className="chip blue">🗣 {l}</span>
        ))}
        {interests.map((i) => (
          <span key={i} className="chip">#{i}</span>
        ))}
      </div>

      {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
    </div>
  );
}
