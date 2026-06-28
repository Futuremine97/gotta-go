"use client";

import { useEffect, useState } from "react";
import GuideCard from "../components/GuideCard";

export default function GuidesPage() {
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
      <h1 className="section-title" style={{ marginTop: 0 }}>동네를 잘 아는 한국인 찾기</h1>
      <p className="section-sub">동네·언어·관심사로 나에게 맞는 가이드를 찾아보세요.</p>

      <div className="card">
        <div className="filters">
          <div>
            <label>동네</label>
            <input placeholder="예: 홍대, 성수, 명동" value={f.neighborhood}
              onChange={(e) => setF({ ...f, neighborhood: e.target.value })} />
          </div>
          <div>
            <label>언어</label>
            <select value={f.language} onChange={(e) => setF({ ...f, language: e.target.value })}>
              <option value="">전체</option>
              <option>영어</option><option>일본어</option><option>중국어</option><option>베트남어</option><option>이탈리아어</option><option>프랑스어</option>
            </select>
          </div>
          <div>
            <label>비용</label>
            <select value={f.priceType} onChange={(e) => setF({ ...f, priceType: e.target.value })}>
              <option value="">전체</option>
              <option value="free">무료/품앗이</option>
              <option value="paid">유료</option>
            </select>
          </div>
          <div>
            <label>키워드</label>
            <input placeholder="예: 카페, 야경, 역사" value={f.q}
              onChange={(e) => setF({ ...f, q: e.target.value })} />
          </div>
          <button className="btn btn-dark" onClick={load}>검색</button>
        </div>
      </div>

      <p className="muted small" style={{ margin: "16px 4px" }}>
        {loading ? "불러오는 중…" : `${guides.length}명의 동네 친구를 찾았어요`}
      </p>

      <div className="grid grid-3">
        {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
      </div>
      {!loading && guides.length === 0 && (
        <div className="notice err">조건에 맞는 가이드가 없어요. 필터를 넓혀보세요.</div>
      )}
    </main>
  );
}
