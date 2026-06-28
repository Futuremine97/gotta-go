"use client";

import { useLang } from "../i18n/LanguageContext";

// 옵션의 value는 DB에 저장되는 한국어 언어명, 라벨만 번역.
const LANG_KEYS = [
  ["영어", "lang.en"],
  ["일본어", "lang.ja"],
  ["중국어", "lang.zh"],
  ["베트남어", "lang.vi"],
  ["이탈리아어", "lang.it"],
  ["프랑스어", "lang.fr"],
  ["한국어", "lang.ko"],
];

// only=["영어",...] 로 표시할 언어 제한 가능
export default function LangOptions({ only }) {
  const { t } = useLang();
  const list = only ? LANG_KEYS.filter(([v]) => only.includes(v)) : LANG_KEYS;
  return (
    <>
      {list.map(([value, key]) => (
        <option key={value} value={value}>{t(key)}</option>
      ))}
    </>
  );
}
