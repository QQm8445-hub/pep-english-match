export interface Word {
  en: string;
  zh: string;
  color: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  time: number;
}

export const GRADE3_UNIT1: Word[] = [
  { en: "pen",       zh: "钢笔",  color: "bg-rose-400" },
  { en: "pencil",    zh: "铅笔",  color: "bg-orange-400" },
  { en: "ruler",     zh: "尺子",  color: "bg-amber-400" },
  { en: "eraser",    zh: "橡皮",  color: "bg-lime-500" },
  { en: "crayon",    zh: "蜡笔",  color: "bg-emerald-400" },
  { en: "book",      zh: "书",    color: "bg-cyan-500" },
  { en: "bag",       zh: "书包",  color: "bg-blue-400" },
  { en: "notebook",  zh: "笔记本", color: "bg-violet-400" },
  { en: "sharpener", zh: "卷笔刀", color: "bg-pink-400" },
  { en: "case",      zh: "铅笔盒", color: "bg-teal-400" },
];

export function initBoard(words: Word[]): (Word | null)[] {
  const total = 25;
  const pool: Word[] = [];
  let i = 0;
  while (pool.length < total) {
    pool.push(words[i % words.length]);
    i++;
  }
  // Fisher-Yates shuffle
  for (let j = pool.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [pool[j], pool[k]] = [pool[k], pool[j]];
  }
  return pool;
}

export function saveScore(name: string, score: number) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("pep_lb");
  const lb: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
  lb.push({ name, score, time: Date.now() });
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem("pep_lb", JSON.stringify(lb.slice(0, 20)));
}

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("pep_lb");
  if (!raw) return [];
  return (JSON.parse(raw) as LeaderboardEntry[]).slice(0, 10);
}

export function speak(word: string) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-US";
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
