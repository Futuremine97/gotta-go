import Link from "next/link";

export default function Disclaimer() {
  return (
    <div className="disclaimer">
      <strong>⚖️ 이용 안내</strong>
      <p>
        잘러는 동네 친구·문화교류·언어교환을 <b>중개</b>하는 플랫폼이에요. 가이드와 여행자는 독립된 개인으로 만나며,
        만남·동행의 내용과 안전에 대한 책임은 당사자에게 있습니다.
        한국 <b>관광진흥법 제38조</b>에 따라 외국인 관광객 대상 <b>유료 관광 안내</b>는
        관광통역안내사 자격 보유자만 가능해요. 자격이 없는 분은 <b>무료/품앗이</b>로 친구·길 도움·언어교환에 참여해주세요.
        개인정보 처리에 관한 사항은 <Link href="/privacy" style={{ textDecoration: "underline" }}>개인정보처리방침</Link>을 확인하세요.
      </p>
    </div>
  );
}
