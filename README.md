# 잘러 (JALR)

> **J**oin **A** **L**ocal in Ko**R**ea — 한국에 온 외국인 관광객·유학생을 *동네를 잘 아는 한국인* 과 연결해주는 웹 서비스.

전문 가이드가 아니어도, 우리 동네를 아는 한국인이면 누구나 가이드가 될 수 있습니다.

## 핵심 기능

1. **누구나 동네 가이드 등록** — 전문 자격 없이 동네 주민도 가이드로 등록 (`/become-guide`)
2. **여행 경로 멀티 매칭** — 하루 동선의 구간(동네)마다 가장 잘 아는 한국인을 여러 명 매칭 (`/trip`)
3. **빠른 도움 / 길찾기** — 길을 잃었을 때 근처 한국인에게 즉석 도움 요청 (`/quick-help`)
4. **어학 연결** — 한국어를 배우려는 외국인 ↔ 외국어를 배우려는 한국인 매칭 (`/language`)

## 기술 스택

- **Next.js 14 (App Router)** — 프론트엔드 + 백엔드 API 한 프로젝트
- **Prisma + PostgreSQL(Neon)** — 클라우드 DB (Vercel 배포 호환)
- **React 18**

## 실행 방법 (로컬)

먼저 무료 Postgres DB(Neon) 연결 문자열이 필요해요. 자세한 건 **[DEPLOY.md](./DEPLOY.md)** 참고.

```bash
# 1) .env 파일의 DATABASE_URL 을 Neon 연결 문자열로 설정

# 2) 의존성 설치
npm install

# 3) DB 테이블 생성
npx prisma db push

# 4) 샘플 데이터 시드 (가이드/어학/도움요청 예시)
npm run db:seed

# 5) 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속.

> 참고: 페이지가 비어 보이면 3·4단계(`db push`, `db:seed`)를 먼저 했는지 확인하세요.

## 배포 & 도메인 (gottago.info)

Vercel 배포와 sav.com 도메인 연결은 **[DEPLOY.md](./DEPLOY.md)** 에 단계별로 정리돼 있어요.

## 프로젝트 구조

```
app/
  page.js                 홈(랜딩)
  guides/page.js          가이드 검색
  become-guide/page.js    가이드 등록
  trip/page.js            여행 경로 멀티 매칭 (핵심)
  quick-help/page.js      빠른 도움 요청
  language/page.js        어학 연결
  api/
    guides/               가이드 검색·등록 API
    trips/                여행 생성·조회·가이드 매칭 API
    quick-help/           도움 요청 API
    language/             어학 매칭 API
  components/GuideCard.js
lib/prisma.js             Prisma 클라이언트 싱글톤
prisma/
  schema.prisma           DB 스키마 (User/Guide/Trip/TripMatch/QuickHelpRequest/LanguageOffer)
  seed.js                 샘플 데이터
```

## 데이터 모델 요약

- **User** — 사용자 (traveler/guide/both)
- **Guide** — 가이드 프로필 (동네·언어·관심사·무료/유료·일반인 여부)
- **Trip** — 여행 경로 (정거장 동네 목록)
- **TripMatch** — 경로의 *구간별* 가이드 매칭 (한 여행에 여러 가이드 = 멀티 매칭)
- **QuickHelpRequest** — 빠른 도움/길찾기 요청
- **LanguageOffer** — 어학 수요(learn)/공급(teach)

## 다음 단계 (확장 아이디어)

- 사용자 로그인/인증 (NextAuth)
- 가이드↔여행자 실시간 채팅·알림
- 지도 연동 (정거장 위치, 근처 도움 요청 위치 기반 매칭)
- 결제(유료 가이드) 및 리뷰/평점 누적
- 프로덕션 DB 전환 (PostgreSQL) 및 배포 (Vercel)
