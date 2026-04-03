"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GRADES = [
  { label: "三年级", value: "3", enabled: true },
  { label: "四年级", value: "4", enabled: false },
  { label: "五年级", value: "5", enabled: false },
  { label: "六年级", value: "6", enabled: false },
];

const UNITS = Array.from({ length: 6 }, (_, i) => ({
  label: `Unit ${i + 1}`,
  value: `${i + 1}`,
  enabled: i === 0,
}));

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("pep_player");
    if (saved) setName(saved);
  }, []);

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      alert("请先输入你的昵称！");
      return;
    }
    localStorage.setItem("pep_player", trimmed);
    router.push(`/game?name=${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* 标题 */}
        <h1 className="text-4xl font-black text-center text-rose-500 mb-1">
          🐣 英语消消乐
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          人教PEP版 · 玩中学英语
        </p>

        {/* 昵称 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            你的昵称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="输入你的名字"
            maxLength={12}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-base outline-none focus:border-sky-400 transition"
          />
        </div>

        {/* 年级选择 */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">选择年级</p>
          <div className="flex gap-2 flex-wrap">
            {GRADES.map((g) => (
              <button
                key={g.value}
                disabled={!g.enabled}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition
                  ${g.enabled
                    ? "border-sky-400 text-sky-500 bg-white hover:bg-sky-50 cursor-pointer"
                    : "border-gray-200 text-gray-300 bg-white cursor-not-allowed"
                  }`}
              >
                {g.label}
                {!g.enabled && (
                  <span className="ml-1 text-xs text-gray-300">🔒</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 单元选择 */}
        <div className="mb-2">
          <p className="text-sm font-semibold text-gray-600 mb-2">选择单元</p>
          <div className="flex gap-2 flex-wrap">
            {UNITS.map((u) => (
              <button
                key={u.value}
                disabled={!u.enabled}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition
                  ${u.enabled
                    ? "border-sky-400 text-sky-500 bg-white hover:bg-sky-50 cursor-pointer"
                    : "border-gray-200 text-gray-300 bg-white cursor-not-allowed"
                  }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-center text-gray-300 mb-8">
          更多年级单元即将开放 🚀
        </p>

        {/* 按钮 */}
        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-full text-lg font-black shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all mb-3"
        >
          🎮 开始游戏
        </button>
        <button
          onClick={() => router.push("/leaderboard")}
          className="w-full py-3 bg-white text-blue-500 border-2 border-sky-300 rounded-full font-bold hover:bg-sky-50 transition"
        >
          🏆 排行榜
        </button>
      </div>
    </main>
  );
}
