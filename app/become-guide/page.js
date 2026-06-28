"use client";

import { useState } from "react";

const INTEREST_TAGS = ["맛집", "카페", "야경", "역사", "쇼핑", "전통", "사진", "한옥", "팝업", "나이트라이프", "길찾기", "뷰티"];

export default function BecomeGuidePage() {
  const [form, setForm] = useState({
    name: "", email: "", neighborhoods: "", languages: "영어",
    bio: "", priceType: "free", isLocal: true,
  });
  const [tags, setTags] = useState([]);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  function toggleTag(t) {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
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
      setMsg("가이드 등록 완료! 이제 여행자들이 회원님을 찾을 수 있어요.");
      setForm({ name: "", email: "", neighborhoods: "", languages: "영어", bio: "", priceType: "free", isLocal: true });
      setTags([]);
    } else {
      const d = await res.json();
      setErr(d.error || "등록에 실패했어요.");
    }
  }

  return (
    <main className="container" style={{ maxWidth: 720 }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>나도 동네 가이드 되기</h1>
      <p className="section-sub">전문 가이드가 아니어도 괜찮아요. 우리 동네를 아는 마음이면 충분합니다.</p>

      <form className="card" onSubmit={submit}>
        {msg && <div className="notice">{msg}</div>}
        {err && <div className="notice err">{err}</div>}

        <div className="grid grid-2">
          <div>
            <label>이름 *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="홍길동" />
          </div>
          <div>
            <label>이메일 *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="me@email.com" />
          </div>
        </div>

        <label>활동 동네 * <span className="muted small">(콤마로 구분)</span></label>
        <input value={form.neighborhoods} onChange={(e) => setForm({ ...form, neighborhoods: e.target.value })} placeholder="예: 홍대, 연남동, 합정" />

        <label>가능 언어 * <span className="muted small">(콤마로 구분)</span></label>
        <input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="예: 영어, 일본어" />

        <label>관심사 / 잘 아는 분야</label>
        <div className="tag-row">
          {INTEREST_TAGS.map((t) => (
            <button type="button" key={t} className={"tag-btn" + (tags.includes(t) ? " on" : "")} onClick={() => toggleTag(t)}>#{t}</button>
          ))}
        </div>

        <label>소개 한마디</label>
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="우리 동네에서 보여주고 싶은 것, 자신 있는 코스를 적어주세요." />

        <div className="grid grid-2">
          <div>
            <label>비용</label>
            <select value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value })}>
              <option value="free">무료 / 품앗이</option>
              <option value="paid">유료</option>
            </select>
          </div>
          <div>
            <label>유형</label>
            <select value={form.isLocal ? "local" : "pro"} onChange={(e) => setForm({ ...form, isLocal: e.target.value === "local" })}>
              <option value="local">🏡 동네 주민 (일반인)</option>
              <option value="pro">🎓 전문/학생 가이드</option>
            </select>
          </div>
        </div>

        <button className="btn btn-dark btn-block" style={{ marginTop: 20 }} disabled={busy}>
          {busy ? "등록 중…" : "가이드로 등록하기"}
        </button>
      </form>
    </main>
  );
}
