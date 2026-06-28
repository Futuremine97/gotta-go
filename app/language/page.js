"use client";

import { useEffect, useState } from "react";

export default function LanguagePage() {
  const [offers, setOffers] = useState([]);
  const [tab, setTab] = useState("all"); // all | learn | teach
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
      setMsg("등록 완료! 서로 맞는 짝을 아래에서 찾아보세요.");
      setForm({ name: "", email: "", kind: "learn", language: "한국어", level: "초급", note: "" });
      load();
    } else {
      const d = await res.json(); setErr(d.error || "등록 실패");
    }
  }

  const filtered = offers.filter((o) => tab === "all" || o.kind === tab);

  return (
    <main className="container" style={{ maxWidth: 920 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>💬 어학 연결</h1>
      <p className="section-sub">한국어를 배우려는 외국인과 외국어를 배우려는 한국인을 짝지어요. 동행이 곧 언어 교환이 됩니다.</p>

      <div className="grid grid-2">
        <form className="card" onSubmit={submit}>
          <h3 style={{ marginTop: 0 }}>나의 어학 수요/공급 등록</h3>
          {msg && <div className="notice">{msg}</div>}
          {err && <div className="notice err">{err}</div>}
          <div className="grid grid-2">
            <div><label>이름 *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label>이메일</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="선택" /></div>
          </div>
          <label>나는…</label>
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
            <option value="learn">이 언어를 배우고 싶어요 (수요)</option>
            <option value="teach">이 언어를 가르쳐줄 수 있어요 (공급)</option>
          </select>
          <div className="grid grid-2">
            <div>
              <label>언어</label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                <option>한국어</option><option>영어</option><option>일본어</option><option>중국어</option><option>프랑스어</option>
              </select>
            </div>
            <div>
              <label>수준</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option>초급</option><option>중급</option><option>고급</option><option>전체</option>
              </select>
            </div>
          </div>
          <label>한마디</label>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="예: 주 1회 카페에서 회화 교환 원해요." />
          <button className="btn btn-dark btn-block" style={{ marginTop: 16 }} disabled={busy}>{busy ? "등록 중…" : "등록하기"}</button>
        </form>

        <div>
          <div className="toolbar" style={{ marginBottom: 12 }}>
            <button className={"tag-btn" + (tab === "all" ? " on" : "")} onClick={() => setTab("all")}>전체</button>
            <button className={"tag-btn" + (tab === "learn" ? " on" : "")} onClick={() => setTab("learn")}>배우고 싶어요</button>
            <button className={"tag-btn" + (tab === "teach" ? " on" : "")} onClick={() => setTab("teach")}>가르쳐줄게요</button>
          </div>
          {filtered.length === 0 && <p className="muted">아직 등록된 항목이 없어요.</p>}
          {filtered.map((o) => (
            <div className="card" key={o.id} style={{ marginBottom: 12, padding: 16 }}>
              <div className="toolbar" style={{ justifyContent: "space-between" }}>
                <strong>{o.name}</strong>
                <span className={"chip " + (o.kind === "learn" ? "blue" : "green")}>
                  {o.kind === "learn" ? "배우고 싶어요" : "가르쳐줄게요"}
                </span>
              </div>
              <div className="small" style={{ margin: "4px 0" }}>
                <span className="chip brand">{o.language}</span><span className="chip">{o.level}</span>
              </div>
              {o.note && <p className="muted small" style={{ margin: 0 }}>{o.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
