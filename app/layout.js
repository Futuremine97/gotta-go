import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata = {
  title: "잘러 (JALR) — 한국 동네를 잘 아는 친구 / A friend who knows the neighborhood",
  description: "외국인 관광객·유학생을 동네를 잘 아는 한국인과 연결해주는 서비스. Connect with locals who know the real Korea.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
          <Nav />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
