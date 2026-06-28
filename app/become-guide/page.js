"use client";

import { useState } from "react";
import Disclaimer from "../components/Disclaimer";
import { useLang } from "../i18n/LanguageContext";

const INTEREST_TAGS = ["맛집", "카페", "야경", "역사", "쇼핑", "전통", "사진", "한옥", "팝업", "나이트라이프", "길찾기", "뷰티"];

export default function BecomeGuidePage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "", email: "", neighborhoods: "", languages: "영어",
    bio: "", priceType: "free", isLocal: true, certNo: "",
  });
  const [tags, setTags] = useState([]);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  function toggleTag(tag) {
    setTags((cur) => (cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg(null); setErr(null);
    const res = await fetch("/api/guides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, interests: tags.join(",") }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg(t("bg.ok"));
      setForm({ name: "", email: "", neighborhoods: "", languages: "영어", bio: "", priceType: "free", isLocal: true, certNo: "" });
      setTags([]);
    } else {
      const d = await res.json();
      setErr(d.error || t("err.generic"));
    }
  }

  return (
    <main className="container" style={{ maxWidth: 720 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>{t("bg.title")}</h1>
      <p className="section-sub">{t("bg.sub")}</p>

      <Disclaimer />

      <form className="card" onSubmit={submit}>
        {msg && <div className="notice">{msg}</div>}
        {err && <div className="notice err">{err}</div>}

        <div className="grid grid-2">
          <div>
            <label>{t("c.name")} *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Hong Gildong" />
          </div>
          <div>
            <label>{t("c.email")} *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="me@email.com" />
          </div>
        </div>

        <label>{t("bg.nbh")} * <span className="muted small">{t("bg.comma")}</span></label>
        <input value={form.neighborhoods} onChange={(e) => setForm({ ...form, neighborhoods: e.target.value })} placeholder={t("bg.nbhPh")} />

        <label>{t("bg.langs")} * <span className="muted small">{t("bg.comma")}</span></label>
        <input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder={t("bg.langsPh")} />

        <label>{t("bg.interests")}</label>
        <div className="tag-row">
          {INTEREST_TAGS.map((tag) => (
            <button type="button" key={tag} className={"tag-btn" + (tags.includes(tag) ? " on" : "")} onClick={() => toggleTag(tag)}>#{tag}</button>
          ))}
        </div>

        <label>{t("bg.bio")}</label>
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder={t("bg.bioPh")} />

        <div className="grid grid-2">
          <div>
            <label>{t("g.cost")}</label>
            <select value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value })}>
              <option value="free">{t("c.free")}</option>
              <option value="paid">{t("bg.paidLabel")}</option>
            </select>
          </div>
          <div>
            <label>{t("bg.type")}</label>
            <select value={form.isLocal ? "local" : "pro"} onChange={(e) => setForm({ ...form, isLocal: e.target.value === "local" })}>
              <option value="local">{t("card.local")}</option>
              <option value="pro">{t("card.pro")}</option>
            </select>
          </div>
        </div>

        {form.priceType === "paid" && (
          <>
            <label>{t("bg.certLabel")} *</label>
            <input value={form.certNo} onChange={(e) => setForm({ ...form, certNo: e.target.value })}
              placeholder="GIT-2023-000000" />
            <p className="muted small" style={{ marginTop: 6 }}>{t("bg.certNote")}</p>
          </>
        )}

        <button className="btn btn-dark btn-block" style={{ marginTop: 20 }} disabled={busy}>
          {busy ? t("bg.submitting") : t("bg.submit")}
        </button>
      </form>
    </main>
  );
}
