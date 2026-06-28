import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "잘러 (JALR) — 한국 동네를 잘 아는 친구",
  description: "외국인 관광객·유학생을 동네를 잘 아는 한국인과 연결해주는 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <nav className="nav">
          <Link href="/" className="logo">잘<span>러</span> · JALR</Link>
          <div className="links">
            <Link href="/guides">가이드 찾기</Link>
            <Link href="/trip">여행 경로 매칭</Link>
            <Link href="/quick-help">빠른 도움</Link>
            <Link href="/language">어학 연결</Link>
            <Link href="/become-guide">가이드 등록</Link>
          </div>
        </nav>
        {children}
        <footer>
          잘러(JALR) — 한국에 온 친구에게 진짜 동네를 알려주는 가장 따뜻한 방법 · MVP 데모
        </footer>
      </body>
    </html>
  );
}
