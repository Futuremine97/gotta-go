"use client";

import { useState } from "react";

export default function TripPage() {
  const [form, setForm] = useState({ name: "", email: "", title: "", date: "" });
  const [stops, setStops] = useState(["", ""]);
  const [recs, setRecs] = useState({});        // stopIndex -> [guides]
  const [picked, setPicked] = useState({});    // stopIndex -> Set(guideId)
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  function setStop(i, v) {
    const next = [...stops]; next[i] = v; setStops(next);
  }
  function addStop() { setStops([...stops, ""]); }
  function removeStop(i) { setStops(stops.filter((_, idx) => idx !== i)); }

  async function findGuides() {
    setBusy(true); setErr(null);
    const cleanStops = stops.map((s) => s.trim()).filter(Boolean);
    if (cleanStops.length === 0) { setErr("경로에 동네를 한 곳 이상 입력해주세요."); setBusy(false); return; }
    const map = {};
    // 원본 stops 인덱스 기준으로 저장 (렌더링과 인덱스 일치)
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
    if (!form.name || !form.title) { setErr("이름과 여행 제목을 입력해주세요."); setBusy(false); return; }

    const tripRes = await fetch("/api/trips", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, stops: cleanStops }),
    });
    if (!tripRes.ok) { setErr("여행 생성에 실패했어요."); setBusy(false); return; }
    const trip = await tripRes.json();

    // picked 는 원본 stops 인덱스 기준이므로 동일하게 순회
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
        <div className="notice">🎉 여행 경로가 만들어지고 가이드 동행 신청이 전송됐어요!</div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{result.trip.title}</h2>
          <div className="muted small">{result.trip.date || "날짜 미정"} · 신청자 {form.name}</div>
          <div className="path">
            {result.stops.map((s, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="stop">{s}</span>
                {i < result.stops.length - 1 && <span className="arrow">→</span>}
              </span>
            ))}
          </div>
          <h3>매칭된 동네 친구 ({result.matches.length}명)</h3>
          {result.matches.length === 0 && <p className="muted">아직 선택한 가이드가 없어요.</p>}
          {result.matches.map((m) => (
            <div className="match-guide" key={m.id}>
              <div className="avatar">{(m.guide.user?.name || "?").slice(0, 1)}</div>
              <div>
                <strong>{m.guide.user?.name}</strong>
                <div className="small muted">{m.stop ? `${m.stop} 구간 담당` : "전체 동행"} · 신청됨</div>
              </div>
              <span className="chip green" style={{ marginLeft: "auto" }}>동행 신청됨</span>
            </div>
          ))}
          <button className="btn btn-dark btn-block" style={{ marginTop: 14 }}
            onClick={() => { setResult(null); setSearched(false); setRecs({}); setPicked({}); setStops(["", ""]); setForm({ name: "", email: "", title: "", date: "" }); }}>
            새 여행 만들기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 820 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>여행 경로 멀티 매칭</h1>
      <p className="section-sub">하루 동선을 적으면, 각 동네를 잘 아는 한국인을 구간마다 붙여드려요.</p>

      {err && <div className="notice err">{err}</div>}

      <div className="card">
        <div className="grid grid-2">
          <div><label>이름 *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
          <div><label>이메일</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="선택" /></div>
        </div>
        <div className="grid grid-2">
          <div><label>여행 제목 *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="예: 서울 첫 하루 투어" /></div>
          <div><label>날짜</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>

        <label>여행 경로 (가고 싶은 동네를 순서대로)</label>
        {stops.map((s, i) => (
          <div key={i} className="toolbar" style={{ marginBottom: 8 }}>
            <span className="chip" style={{ margin: 0 }}>{i + 1}</span>
            <input style={{ flex: 1 }} value={s} onChange={(e) => setStop(i, e.target.value)} placeholder={`예: ${["경복궁", "북촌", "인사동", "명동", "홍대"][i] || "동네 이름"}`} />
            {stops.length > 1 && <button className="tag-btn" onClick={() => removeStop(i)}>✕</button>}
          </div>
        ))}
        <button className="tag-btn" onClick={addStop}>+ 정거장 추가</button>

        <button className="btn btn-dark btn-block" style={{ marginTop: 18 }} onClick={findGuides} disabled={busy}>
          {busy ? "찾는 중…" : "구간별 가이드 추천받기 →"}
        </button>
      </div>

      {searched && (
        <>
          <h2 className="section-title">구간별 추천 가이드</h2>
          <p className="section-sub">각 동네에서 함께할 친구를 골라주세요. 한 경로에 여러 명도 OK!</p>
          {stops.map((s, i) => s.trim() && (
            <div className="card" key={i} style={{ marginBottom: 16 }}>
              <h3 style={{ marginTop: 0 }}>📍 {s.trim()}</h3>
              {(recs[i] || []).length === 0 && <p className="muted small">이 동네 가이드를 아직 못 찾았어요. 다른 동네 친구가 도와줄 수도 있어요.</p>}
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
                        <span className="chip">{g.priceType === "free" ? "무료/품앗이" : "유료"}</span>
                      </div>
                    </div>
                    <button className={"btn " + (on ? "btn-dark" : "btn-ghost")} style={on ? { marginLeft: "auto" } : { marginLeft: "auto", background: "var(--chip)", color: "var(--ink)", border: "none" }}
                      onClick={() => togglePick(i, g.id)}>
                      {on ? "✓ 선택됨" : "동행 선택"}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="card toolbar" style={{ justifyContent: "space-between" }}>
            <div><strong>{totalPicked}명</strong> <span className="muted">선택됨</span></div>
            <button className="btn btn-dark" onClick={createTrip} disabled={busy}>
              {busy ? "처리 중…" : "이 구성으로 여행 만들기 →"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
