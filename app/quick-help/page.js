"use client";

import { useEffect, useState } from "react";

export default function QuickHelpPage() {
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
      setMsg("도움 요청이 등록됐어요! 근처 한국인에게 알림이 갑니다.");
      setForm({ name: "", location: "", language: "영어", message: "" });
      load();
    } else {
      const d = await res.json(); setErr(d.error || "등록 실패");
    }
  }

  async function claim(id) {
    await fetch(`/api/quick-help/${id}/claim`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    load();
  }

  return (
    <main className="container" style={{ maxWidth: 880 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>⚡ 잠깐만 도와주세요</h1>
      <p className="section-sub">길을 잃었거나 메뉴를 못 읽을 때, 근처 한국인에게 5분짜리 도움을 요청하세요.</p>

      <div className="grid grid-2">
        <form className="card" onSubmit={submit}>
          <h3 style={{ marginTop: 0 }}>도움 요청하기</h3>
          {msg && <div className="notice">{msg}</div>}
          {err && <div className="notice err">{err}</div>}
          <label>이름 *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          <label>현재 위치 *</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="예: 홍대입구역 9번 출구" />
          <label>선호 언어</label>
          <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <option>영어</option><option>일본어</option><option>중국어</option><option>한국어</option>
          </select>
          <label>도움 내용 *</label>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="예: 공항철도 타는 곳을 못 찾겠어요!" />
          <button className="btn btn-dark btn-block" style={{ marginTop: 16 }} disabled={busy}>{busy ? "전송 중…" : "근처에 도움 요청"}</button>
        </form>

        <div>
          <h3 style={{ marginTop: 0 }}>주변 도움 요청 ({list.filter((r) => r.status === "open").length} 건 대기중)</h3>
          {list.length === 0 && <p className="muted">아직 요청이 없어요.</p>}
          {list.map((r) => (
            <div className="card" key={r.id} style={{ marginBottom: 12, padding: 16 }}>
              <div className="toolbar" style={{ justifyContent: "space-between" }}>
                <strong>{r.name}</strong>
                <span className={"chip " + (r.status === "open" ? "brand" : "green")}>
                  {r.status === "open" ? "대기중" : "도움 연결됨"}
                </span>
              </div>
              <div className="small muted" style={{ margin: "4px 0" }}>📍 {r.location} · 🗣 {r.language}</div>
              <p style={{ margin: "6px 0" }}>{r.message}</p>
              {r.status === "open" && (
                <button className="btn btn-dark" onClick={() => claim(r.id)}>내가 도와줄게요</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
