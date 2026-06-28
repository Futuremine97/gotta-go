const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 초기화
  await prisma.tripMatch.deleteMany();
  await prisma.quickHelpRequest.deleteMany();
  await prisma.languageOffer.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.user.deleteMany();

  const guides = [
    {
      name: "지은",
      email: "jieun@example.com",
      neighborhoods: "홍대,연남동,합정",
      languages: "영어,일본어",
      bio: "연남동 토박이예요. 숨은 카페와 로컬 맛집 안내 자신 있어요!",
      interests: "카페,맛집,쇼핑,사진",
      priceType: "free",
      isLocal: true,
      rating: 4.9,
    },
    {
      name: "민준",
      email: "minjun@example.com",
      neighborhoods: "경복궁,북촌,서촌,인사동",
      languages: "영어",
      bio: "역사 전공 대학생입니다. 고궁과 한옥마을 스토리텔링 좋아해요.",
      interests: "역사,한옥,전통,산책",
      priceType: "paid",
      certNo: "GIT-2023-014872",
      isLocal: false,
      rating: 4.8,
    },
    {
      name: "서연",
      email: "seoyeon@example.com",
      neighborhoods: "명동,남산,동대문",
      languages: "영어,중국어",
      bio: "쇼핑과 야경 코스 전문! 동대문 새벽시장도 같이 가요.",
      interests: "쇼핑,야경,뷰티,맛집",
      priceType: "free",
      isLocal: true,
      rating: 4.7,
    },
    {
      name: "도현",
      email: "dohyun@example.com",
      neighborhoods: "이태원,한남동,경리단길",
      languages: "영어,프랑스어",
      bio: "이태원 근처 직장인. 퇴근 후 펍/맛집 투어 같이 다녀요.",
      interests: "맥주,세계음식,음악,나이트라이프",
      priceType: "paid",
      certNo: "GIT-2022-009531",
      isLocal: true,
      rating: 4.6,
    },
    {
      name: "하늘",
      email: "haneul@example.com",
      neighborhoods: "성수,건대,왕십리",
      languages: "영어,일본어",
      bio: "성수동 카페거리와 팝업스토어 정보는 제가 제일 빨라요.",
      interests: "카페,팝업,편집샵,사진",
      priceType: "free",
      isLocal: true,
      rating: 4.9,
    },
    {
      name: "준호",
      email: "junho@example.com",
      neighborhoods: "강남,가로수길,압구정",
      languages: "영어",
      bio: "강남 토박이. 길찾기 도움이나 짧은 동행도 환영합니다.",
      interests: "쇼핑,맛집,길찾기,카페",
      priceType: "free",
      isLocal: true,
      rating: 4.5,
    },
  ];

  for (const g of guides) {
    const user = await prisma.user.create({
      data: { name: g.name, email: g.email, role: "guide" },
    });
    await prisma.guide.create({
      data: {
        userId: user.id,
        neighborhoods: g.neighborhoods,
        languages: g.languages,
        bio: g.bio,
        interests: g.interests,
        priceType: g.priceType,
        certNo: g.certNo || "",
        isLocal: g.isLocal,
        rating: g.rating,
      },
    });
  }

  // 어학 연결 샘플
  const langSamples = [
    { name: "지은", email: "jieun@example.com", kind: "learn", language: "영어", level: "중급", note: "주 1회 카페에서 회화 교환 원해요." },
    { name: "Emma", email: "emma@example.com", kind: "learn", language: "한국어", level: "초급", note: "한국어 왕초보, 한국 드라마 좋아해요." },
    { name: "민준", email: "minjun@example.com", kind: "teach", language: "한국어", level: "전체", note: "한국어 가르쳐드릴 수 있어요. 영어 배우고 싶어요." },
  ];
  for (const l of langSamples) {
    const user = await prisma.user.upsert({
      where: { email: l.email },
      update: {},
      create: { name: l.name, email: l.email, role: "both" },
    });
    await prisma.languageOffer.create({
      data: { userId: user.id, name: l.name, kind: l.kind, language: l.language, level: l.level, note: l.note },
    });
  }

  // 빠른 도움 요청 샘플
  await prisma.quickHelpRequest.create({
    data: { name: "Kenji", location: "홍대입구역 9번 출구", language: "일본어", message: "공항철도 타는 곳을 못 찾겠어요. 잠깐 도와주실 분!" },
  });

  console.log("Seed 완료 ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
