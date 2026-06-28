# 배포 & 도메인 연결 가이드 (gottago.info)

목표: 잘러(JALR) 앱을 **Vercel**에 배포하고 **gottago.info** 도메인으로 접속되게 만들기.

전체 흐름: ① 무료 DB(Neon) 만들기 → ② 코드 GitHub 올리기 → ③ Vercel 배포 → ④ 도메인 연결(sav.com DNS).

소요 시간: 약 20~30분. 신용카드 필요 없음(모두 무료 플랜).

---

## ① 무료 Postgres DB 만들기 (Neon)

Vercel은 서버리스라 SQLite 파일을 못 써요. 무료 클라우드 DB를 하나 만듭니다.

1. https://neon.tech 접속 → **Sign up** (GitHub 계정으로 가입하면 편함)
2. **Create project** → 이름 아무거나(예: `jalr`), 리전은 **AWS / Singapore** 또는 가까운 곳 선택
3. 생성되면 **Connection string** 화면이 나옵니다. **"Pooled connection"** 토글을 켜고, 문자열을 복사
   - 형태: `postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require`
4. 이 문자열을 잘 보관하세요. 아래에서 두 번 씁니다.

### 로컬에서 DB 초기화 (한 번만)

> 컴퓨터에 Node.js가 설치돼 있어야 해요(앞서 안내한 nodejs.org LTS).

```bash
cd ~/Downloads/jalr

# .env 파일을 열어 DATABASE_URL 을 위에서 복사한 Neon 문자열로 바꾸기
#   (.env 파일이 안 보이면: 텍스트 편집기로 ~/Downloads/jalr/.env 열기)

npm install
npx prisma db push      # Neon에 테이블 생성
npm run db:seed         # 샘플 가이드 데이터 넣기
npm run dev             # http://localhost:3000 에서 확인
```

여기까지 로컬에서 잘 뜨면 절반은 끝났어요.

---

## ② 코드를 GitHub에 올리기

Vercel은 GitHub 저장소를 보고 자동 배포합니다.

1. 저장소: https://github.com/Futuremine97/gotta-go (이미 생성됨)
2. 터미널에서:

```bash
cd ~/Downloads/jalr
git init
git add .
git commit -m "잘러 첫 배포"
git branch -M main
git remote add origin https://github.com/Futuremine97/gotta-go.git
git push -u origin main
```

> `git remote add` 에서 "already exists" 에러가 나면:
> `git remote set-url origin https://github.com/Futuremine97/gotta-go.git` 후 다시 push.

> `.env`는 `.gitignore`에 들어있어 **업로드되지 않아요**(비밀번호 보호). DB 연결값은 ③에서 Vercel에 따로 넣습니다.

---

## ③ Vercel에 배포

1. https://vercel.com 접속 → **Sign up** → GitHub로 로그인
2. **Add New… → Project** → `gotta-go` 저장소 **Import**
3. 배포 설정 화면에서 **Environment Variables** 펼치기:
   - Name: `DATABASE_URL`
   - Value: ①에서 복사한 Neon **Pooled** 연결 문자열 붙여넣기
   - **Add** 클릭
4. **Deploy** 클릭 → 1~2분 기다리면 `xxxx.vercel.app` 주소로 사이트가 떠요.

> 빌드 시 자동으로 `prisma generate`가 실행됩니다(설정해둠). 테이블은 ①에서 이미 만들었으니 그대로 동작해요.

---

## ④ gottago.info 도메인 연결 (sav.com)

### 4-1. Vercel에 도메인 추가

1. Vercel 프로젝트 → **Settings → Domains**
2. 입력칸에 `gottago.info` 입력 → **Add**
3. `www.gottago.info`도 추가(선택, 권장) → Vercel이 자동으로 `gottago.info`로 리다이렉트 설정
4. **Vercel이 화면에 필요한 DNS 레코드 값을 보여줍니다.** 이 값이 정답이에요. 보통:
   - **A 레코드** (apex `gottago.info`용): `76.76.21.21` (또는 Vercel이 보여주는 프로젝트 전용 값)
   - **CNAME 레코드** (`www`용): `cname.vercel-dns.com` (또는 Vercel이 보여주는 값)

   > Vercel은 최근 프로젝트별 전용 주소(예: `xxxx.vercel-dns-016.com`)를 안내하기도 해요. **항상 Vercel 대시보드에 표시된 값을 그대로** 사용하세요.

### 4-2. sav.com에서 DNS 설정

1. https://www.sav.com 로그인 → **My Domains** → `gottago.info` 선택
2. **DNS** 또는 **Manage DNS / DNS Records** 메뉴 진입
3. 아래 두 레코드를 추가/수정 (Vercel이 보여준 값으로):

   | Type  | Host/Name | Value                          | TTL   |
   |-------|-----------|--------------------------------|-------|
   | A     | `@`       | `76.76.21.21` (Vercel 표시값)  | 자동/3600 |
   | CNAME | `www`     | `cname.vercel-dns.com` (표시값)| 자동/3600 |

   - `@` 는 도메인 자체(gottago.info)를 의미해요. sav.com에서 빈칸 또는 `gottago.info`로 표기될 수 있어요.
   - 기존에 있던 다른 A/CNAME 레코드(주차 페이지 등)는 **삭제**하세요. 충돌 나요.
4. 저장.

### 4-3. 기다리기

- DNS 전파에 보통 **10분~수 시간**(최대 48시간) 걸려요.
- Vercel **Settings → Domains**에서 `gottago.info` 옆에 **초록색 "Valid Configuration"** 이 뜨면 완료. HTTPS 인증서도 Vercel이 자동 발급합니다.
- https://gottago.info 접속해서 확인!

---

## 자주 막히는 부분

- **"Invalid Configuration"이 계속 떠요** → sav.com DNS 값이 Vercel 표시값과 정확히 같은지, 기존 충돌 레코드를 지웠는지 확인. 전파 시간을 더 기다려보세요.
- **사이트는 뜨는데 데이터가 없어요** → ①의 `npx prisma db push` + `npm run db:seed`를 Neon 연결값으로 실행했는지 확인.
- **앞으로 코드 수정 시** → `git add . && git commit -m "수정" && git push` 하면 Vercel이 자동 재배포해요.

---

## 참고 (Vercel 공식 문서)

- 커스텀 도메인 설정: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- A 레코드 안내: https://vercel.com/kb/guide/a-record-and-caa-with-vercel
- DNS 관리: https://vercel.com/docs/domains/managing-dns-records
