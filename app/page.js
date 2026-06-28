import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>한국에 온 친구에게<br />진짜 동네를 알려주는 사람</h1>
        <p>
          외국인 관광객·유학생을, 그 동네를 잘 아는 한국인과 연결합니다.
          전문 가이드가 아니어도 괜찮아요. 한 번의 여행 경로에 여러 명의 동네 친구를 매칭하고,
          길을 잃었을 땐 잠깐 도움도 받고, 서로의 언어까지 배워요.
        </p>
        <div className="cta">
          <Link href="/guides" className="btn btn-primary">동네 친구 찾기 →</Link>
          <Link href="/become-guide" className="btn btn-ghost">나도 가이드 되기</Link>
        </div>
      </section>

      <h2 className="section-title">잘러는 이렇게 달라요</h2>
      <p className="section-sub">전문 투어가 아니라, 동네 사람의 시선으로 만나는 한국.</p>
      <div className="grid grid-2">
        <div className="card">
          <h3>🧭 누구나 동네 가이드</h3>
          <p className="muted">전문 자격이 없어도, 우리 동네 맛집·골목·꿀팁을 아는 한국인이면 누구나 가이드로 등록할 수 있어요.</p>
        </div>
        <div className="card">
          <h3>🗺️ 한 경로, 여러 가이드 멀티 매칭</h3>
          <p className="muted">경복궁은 역사 덕후에게, 홍대는 카페 토박이에게. 하루 동선의 구간마다 가장 잘 아는 사람을 붙입니다.</p>
        </div>
        <div className="card">
          <h3>⚡ 잠깐만 도와주세요</h3>
          <p className="muted">지하철 출구를 못 찾을 때, 메뉴를 못 읽을 때. 근처 한국인에게 5분짜리 길찾기 도움을 즉석으로 요청하세요.</p>
        </div>
        <div className="card">
          <h3>💬 어학 연결</h3>
          <p className="muted">한국어를 배우고 싶은 외국인과 영어·일본어를 배우고 싶은 한국인을 짝지어요. 동행이 곧 언어 교환이 됩니다.</p>
        </div>
      </div>

      <h2 className="section-title">3분이면 시작</h2>
      <p className="section-sub">복잡한 절차 없이 바로 연결됩니다.</p>
      <div className="card">
        <div className="step"><div className="num">1</div><div><strong>여행 경로를 입력</strong><div className="muted small">가고 싶은 동네를 순서대로 적어요. (예: 경복궁 → 북촌 → 인사동 → 명동)</div></div></div>
        <div className="step"><div className="num">2</div><div><strong>구간별 가이드 자동 추천</strong><div className="muted small">각 동네를 잘 아는 한국인을 추천받고, 마음에 드는 사람을 골라 동행을 신청해요.</div></div></div>
        <div className="step"><div className="num">3</div><div><strong>만나서 진짜 한국을 경험</strong><div className="muted small">필요하면 빠른 도움·어학 교환까지. 동네 친구와 함께라면 길 잃을 일이 없어요.</div></div></div>
        <Link href="/trip" className="btn btn-dark btn-block" style={{ marginTop: 8 }}>여행 경로 매칭 시작하기 →</Link>
      </div>
    </main>
  );
}
