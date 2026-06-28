"use client";

import { useEffect, useState } from "react";
import LangOptions from "../components/LangOptions";
import { useLang } from "../i18n/LanguageContext";

export default function LanguagePage() {
  const { t } = useLang();
  const [offers, setOffers] = useState([]);
  const [tab, setTab] = useState("all");
  const [form, setForm] = useState({ name: "", email: "", kind: "learn", language: "한국어", level: "초급", note: "" });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/language");
    setOffers(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg(null); setErr(null);
    const res = await fetch("/api/language", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      setMsg(t("l.ok"));
      setForm({ name: "", email: "", kind: "learn", language: "한국어", level: "초급", note: "" });
      load();
    } else {
      const d = await res.json(); setErr(d.error || t("err.generic"));
    }
  }

  const filtered = offers.filter((o) => tab === "all" || o.kind === tab);

  // 레벨 표시 번역 (DB값은 한국어)
  const levelLabel = (lv) => ({ "초급": t("l.lv1"), "중급": t("l.lv2"), "고급": t("l.lv3"), "전체": t("l.lvAll") }[lv] || lv);

  return (
    <main className="container" style={{ maxWidth: 920 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>{t("l.title")}</h1>
      <p className="section-sub">{t("l.sub")}</p>

      <div className="grid grid-2">
        <form className="card" onSubmit={submit}>
          <h3 style={{ marginTop: 0 }}>{t("l.formTitle")}</h3>
          {msg && <div className="notice">{msg}</div>}
          {err && <div className="notice err">{err}</div>}
          <div className="grid grid-2">
            <div><label>{t("c.name")} *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label>{t("c.email")}</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("c.optional")} /></div>
          </div>
          <label>{t("l.iam")}</label>
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
            <option value="learn">{t("l.learn")}</option>
            <option value="teach">{t("l.teach")}</option>
          </select>
          <div className="grid grid-2">
            <div>
              <label>{t("c.langName")}</label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                <LangOptions only={["한국어", "영어", "일본어", "중국어", "베트남어", "이탈리아어", "프랑스어"]} />
              </select>
            </div>
            <div>
              <label>{t("l.level")}</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option value="초급">{t("l.lv1")}</option>
                <option value="중급">{t("l.lv2")}</option>
                <option value="고급">{t("l.lv3")}</option>
                <option value="전체">{t("l.lvAll")}</option>
              </select>
            </div>
          </div>
          <label>{t("l.note")}</label>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder={t("l.notePh")} />
          <button className="btn btn-dark btn-block" style={{ marginTop: 16 }} disabled={busy}>{busy ? t("l.submitting") : t("l.submit")}</button>
        </form>

        <div>
          <div className="toolbar" style={{ marginBottom: 12 }}>
            <button className={"tag-btn" + (tab === "all" ? " on" : "")} onClick={() => setTab("all")}>{t("l.tabAll")}</button>
            <button className={"tag-btn" + (tab === "learn" ? " on" : "")} onClick={() => setTab("learn")}>{t("l.tabLearn")}</button>
            <button className={"tag-btn" + (tab === "teach" ? " on" : "")} onClick={() => setTab("teach")}>{t("l.tabTeach")}</button>
          </div>
          {filtered.length === 0 && <p className="muted">{t("l.empty")}</p>}
          {filtered.map((o) => (
            <div className="card" key={o.id} style={{ marginBottom: 12, padding: 16 }}>
              <div className="toolbar" style={{ justifyContent: "space-between" }}>
                <strong>{o.name}</strong>
                <span className={"chip " + (o.kind === "learn" ? "blue" : "green")}>
                  {o.kind === "learn" ? t("l.badgeLearn") : t("l.badgeTeach")}
                </span>
              </div>
              <div className="small" style={{ margin: "4px 0" }}>
                <span className="chip brand">{o.language}</span><span className="chip">{levelLabel(o.level)}</span>
              </div>
              {o.note && <p className="muted small" style={{ margin: 0 }}>{o.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
