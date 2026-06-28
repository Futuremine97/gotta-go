"use client";

import { useEffect, useState } from "react";
import LangOptions from "../components/LangOptions";
import { useLang } from "../i18n/LanguageContext";

export default function QuickHelpPage() {
  const { t } = useLang();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", language: "영어", message: "" });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/quick-help");
    setList(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg(null); setErr(null);
    const res = await fetch("/api/quick-help", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      setMsg(t("q.ok"));
      setForm({ name: "", location: "", language: "영어", message: "" });
      load();
    } else {
      const d = await res.json(); setErr(d.error || t("err.generic"));
    }
  }

  async function claim(id) {
    await fetch(`/api/quick-help/${id}/claim`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    load();
  }

  const openCount = list.filter((r) => r.status === "open").length;

  return (
    <main className="container" style={{ maxWidth: 880 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>{t("q.title")}</h1>
      <p className="section-sub">{t("q.sub")}</p>

      <div className="grid grid-2">
        <form className="card" onSubmit={submit}>
          <h3 style={{ marginTop: 0 }}>{t("q.formTitle")}</h3>
          {msg && <div className="notice">{msg}</div>}
          {err && <div className="notice err">{err}</div>}
          <label>{t("c.name")} *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          <label>{t("q.location")} *</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={t("q.locationPh")} />
          <label>{t("q.prefLang")}</label>
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <LangOptions only={["영어", "일본어", "중국어", "베트남어", "이탈리아어", "한국어"]} />
          </select>
          <label>{t("q.message")} *</label>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("q.messagePh")} />
          <button className="btn btn-dark btn-block" style={{ marginTop: 16 }} disabled={busy}>{busy ? t("q.sending") : t("q.submit")}</button>
        </form>

        <div>
          <h3 style={{ marginTop: 0 }}>{t("q.listTitle")} ({openCount} {t("q.waiting")})</h3>
          {list.length === 0 && <p className="muted">{t("q.none")}</p>}
          {list.map((r) => (
            <div className="card" key={r.id} style={{ marginBottom: 12, padding: 16 }}>
              <div className="toolbar" style={{ justifyContent: "space-between" }}>
                <strong>{r.name}</strong>
                <span className={"chip " + (r.status === "open" ? "brand" : "green")}>
                  {r.status === "open" ? t("q.statusOpen") : t("q.statusClaimed")}
                </span>
              </div>
              <div className="small muted" style={{ margin: "4px 0" }}>📍 {r.location} · 🗣 {r.language}</div>
              <p style={{ margin: "6px 0" }}>{r.message}</p>
              {r.status === "open" && (
                <button className="btn btn-dark" onClick={() => claim(r.id)}>{t("q.claim")}</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
