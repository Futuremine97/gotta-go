"use client";

import { useEffect, useState } from "react";
import GuideCard from "../components/GuideCard";
import LangOptions from "../components/LangOptions";
import { useLang } from "../i18n/LanguageContext";

export default function GuidesPage() {
  const { t } = useLang();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState({ neighborhood: "", language: "", priceType: "", q: "" });

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => v && params.set(k, v));
    const res = await fetch("/api/guides?" + params.toString());
    setGuides(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <main className="container">
      <h1 className="section-title" style={{ marginTop: 0 }}>{t("g.title")}</h1>
      <p className="section-sub">{t("g.sub")}</p>

      <div className="card">
        <div className="filters">
          <div>
            <label>{t("g.neighborhood")}</label>
            <input placeholder={t("g.neighborhoodPh")} value={f.neighborhood}
              onChange={(e) => setF({ ...f, neighborhood: e.target.value })} />
          </div>
          <div>
            <label>{t("c.langName")}</label>
            <select value={f.language} onChange={(e) => setF({ ...f, language: e.target.value })}>
              <option value="">{t("c.all")}</option>
              <LangOptions only={["영어", "일본어", "중국어", "베트남어", "이탈리아어", "프랑스어"]} />
            </select>
          </div>
          <div>
            <label>{t("g.cost")}</label>
            <select value={f.priceType} onChange={(e) => setF({ ...f, priceType: e.target.value })}>
              <option value="">{t("c.all")}</option>
              <option value="free">{t("c.free")}</option>
              <option value="paid">{t("c.paid")}</option>
            </select>
          </div>
          <div>
            <label>{t("g.keyword")}</label>
            <input placeholder={t("g.keywordPh")} value={f.q}
              onChange={(e) => setF({ ...f, q: e.target.value })} />
          </div>
          <button className="btn btn-dark" onClick={load}>{t("c.search")}</button>
        </div>
      </div>

      <p className="muted small" style={{ margin: "16px 4px" }}>
        {loading ? t("c.loading") : t("g.count", { n: guides.length })}
      </p>

      <div className="grid grid-3">
        {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
      </div>
      {!loading && guides.length === 0 && (
        <div className="notice err">{t("g.empty")}</div>
      )}
    </main>
  );
}
