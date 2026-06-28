"use client";

import { useState } from "react";
import { useLang } from "../i18n/LanguageContext";

export default function TripPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", title: "", date: "" });
  const [stops, setStops] = useState(["", ""]);
  const [recs, setRecs] = useState({});
  const [picked, setPicked] = useState({});
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  function setStop(i, v) { const next = [...stops]; next[i] = v; setStops(next); }
  function addStop() { setStops([...stops, ""]); }
  function removeStop(i) { setStops(stops.filter((_, idx) => idx !== i)); }

  async function findGuides() {
    setBusy(true); setErr(null);
    const cleanStops = stops.map((s) => s.trim()).filter(Boolean);
    if (cleanStops.length === 0) { setErr(t("t.errRoute")); setBusy(false); return; }
    const map = {};
    for (let i = 0; i < stops.length; i++) {
      const s = stops[i].trim();
      if (!s) continue;
      const res = await fetch("/api/guides?neighborhood=" + encodeURIComponent(s));
      map[i] = await res.json();
    }
    setRecs(map);
    setSearched(true);
    setBusy(false);
  }

  function togglePick(i, guideId) {
    setPicked((cur) => {
      const set = new Set(cur[i] || []);
      set.has(guideId) ? set.delete(guideId) : set.add(guideId);
      return { ...cur, [i]: set };
    });
  }

  async function createTrip() {
    setBusy(true); setErr(null);
    const cleanStops = stops.map((s) => s.trim()).filter(Boolean);
    if (!form.name || !form.title) { setErr(t("t.errNameTitle")); setBusy(false); return; }

    const tripRes = await fetch("/api/trips", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, stops: cleanStops }),
    });
    if (!tripRes.ok) { setErr(t("err.generic")); setBusy(false); return; }
    const trip = await tripRes.json();

    const matches = [];
    stops.forEach((raw, i) => {
      const stop = raw.trim();
      if (!stop) return;
      (picked[i] ? [...picked[i]] : []).forEach((guideId) => matches.push({ guideId, stop }));
    });

    let matchData = { matches: [] };
    if (matches.length) {
      const mRes = await fetch(`/api/trips/${trip.id}/match`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matches }),
      });
      matchData = await mRes.json();
    }
    setResult({ trip, stops: cleanStops, matches: matchData.matches });
    setBusy(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const totalPicked = Object.values(picked).reduce((a, s) => a + s.size, 0);

  if (result) {
    return (
      <main className="container" style={{ maxWidth: 760 }}>
        <div className="notice">{t("t.done")}</div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{result.trip.title}</h2>
          <div className="muted small">{result.trip.date || t("t.dateTbd")} · {t("t.applicant")} {form.name}</div>
          <div className="path">
            {result.stops.map((s, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="stop">{s}</span>
                {i < result.stops.length - 1 && <span className="arrow">→</span>}
              </span>
            ))}
          </div>
          <h3>{t("t.matched")} ({result.matches.length})</h3>
          {result.matches.length === 0 && <p className="muted">{t("t.noneSelected")}</p>}
          {result.matches.map((m) => (
            <div className="match-guide" key={m.id}>
              <div className="avatar">{(m.guide.user?.name || "?").slice(0, 1)}</div>
              <div>
                <strong>{m.guide.user?.name}</strong>
                <div className="small muted">{m.stop ? `${m.stop} · ${t("t.legOf")}` : t("t.fullTrip")}</div>
              </div>
              <span className="chip green" style={{ marginLeft: "auto" }}>{t("t.requested")}</span>
            </div>
          ))}
          <button className="btn btn-dark btn-block" style={{ marginTop: 14 }}
            onClick={() => { setResult(null); setSearched(false); setRecs({}); setPicked({}); setStops(["", ""]); setForm({ name: "", email: "", title: "", date: "" }); }}>
            {t("t.newTrip")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>{t("t.title")}</h1>
      <p className="section-sub">{t("t.sub")}</p>

      {err && <div className="notice err">{err}</div>}

      <div className="card">
        <div className="grid grid-2">
          <div><label>{t("c.name")} *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
          <div><label>{t("c.email")}</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("c.optional")} /></div>
        </div>
        <div className="grid grid-2">
          <div><label>{t("t.tripTitle")} *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t("t.tripTitlePh")} /></div>
          <div><label>{t("t.date")}</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>

        <label>{t("t.route")}</label>
        {stops.map((s, i) => (
          <div key={i} className="toolbar" style={{ marginBottom: 8 }}>
            <span className="chip" style={{ margin: 0 }}>{i + 1}</span>
            <input style={{ flex: 1 }} value={s} onChange={(e) => setStop(i, e.target.value)} placeholder={`${["경복궁", "북촌", "인사동", "명동", "홍대"][i] || t("t.stopPh")}`} />
            {stops.length > 1 && <button className="tag-btn" onClick={() => removeStop(i)}>✕</button>}
          </div>
        ))}
        <button className="tag-btn" onClick={addStop}>{t("t.addStop")}</button>

        <button className="btn btn-dark btn-block" style={{ marginTop: 18 }} onClick={findGuides} disabled={busy}>
          {busy ? t("t.finding") : t("t.recommend")}
        </button>
      </div>

      {searched && (
        <>
          <h2 className="section-title">{t("t.recTitle")}</h2>
          <p className="section-sub">{t("t.recSub")}</p>
          {stops.map((s, i) => s.trim() && (
            <div className="card" key={i} style={{ marginBottom: 16 }}>
              <h3 style={{ marginTop: 0 }}>📍 {s.trim()}</h3>
              {(recs[i] || []).length === 0 && <p className="muted small">{t("t.noGuide")}</p>}
              {(recs[i] || []).map((g) => {
                const on = picked[i]?.has(g.id);
                return (
                  <div className="match-guide" key={g.id} style={on ? { borderColor: "var(--brand)", background: "#fff7f4" } : {}}>
                    <div className="avatar">{(g.user?.name || "?").slice(0, 1)}</div>
                    <div>
                      <strong>{g.user?.name}</strong> <span className="rating small">★ {Number(g.rating).toFixed(1)}</span>
                      <div className="small muted">{g.bio}</div>
                      <div style={{ marginTop: 4 }}>
                        {(g.languages || "").split(",").filter(Boolean).map((l) => <span key={l} className="chip blue">{l}</span>)}
                        <span className="chip">{g.priceType === "free" ? t("c.free") : t("c.paid")}</span>
                      </div>
                    </div>
                    <button className={"btn " + (on ? "btn-dark" : "btn-ghost")} style={on ? { marginLeft: "auto" } : { marginLeft: "auto", background: "var(--chip)", color: "var(--ink)", border: "none" }}
                      onClick={() => togglePick(i, g.id)}>
                      {on ? t("t.picked") : t("t.pick")}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="card toolbar" style={{ justifyContent: "space-between" }}>
            <div><strong>{totalPicked}</strong> <span className="muted">{t("t.pickedCount")}</span></div>
            <button className="btn btn-dark" onClick={createTrip} disabled={busy}>
              {busy ? t("t.processing") : t("t.create")}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
