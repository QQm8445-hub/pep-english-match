"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LeaderboardEntry, loadLeaderboard } from "@/lib/words";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const router = useRouter();
  const [list, setList] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setList(loadLeaderboard());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-center text-rose-500 mb-6">
          🏆 排行榜
        </h1>

        {list.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-lg">
            <div className="text-5xl mb-4">🎮</div>
            暂无记录，快去游玩吧！
          </div>
        ) : (
          <ul className="space-y-2">
            {list.map((item, i) => (
              <li
                key={i}
                className={`flex items-center px-4 py-3 rounded-2xl font-bold
                  ${i === 0
                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md"
                    : i === 1
                    ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-md"
                    : i === 2
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md"
                    : "bg-gray-50 text-gray-700"
                  }`}
              >
                <span className="w-10 text-xl text-center">
                  {MEDALS[i] ?? i + 1}
                </span>
                <span className="flex-1 truncate">{item.name}</span>
                <span className="text-lg">{item.score} 分</span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full py-3 bg-white border-2 border-sky-300 text-blue-500 rounded-full font-bold hover:bg-sky-50 transition"
        >
          ← 返回首页
        </button>
      </div>
    </main>
  );
}
