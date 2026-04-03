"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import { GRADE3_UNIT1, Word, initBoard, saveScore, speak } from "@/lib/words";

interface ModalProps {
  win: boolean;
  score: number;
  onReplay: () => void;
  onHome: () => void;
}

function ResultModal({ win, score, onReplay, onHome }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">{win ? "🎉" : "😢"}</div>
        <h2
          className={`text-2xl font-black mb-2 ${
            win ? "text-rose-500" : "text-gray-500"
          }`}
        >
          {win ? "太棒了！通关！" : "再试一次！"}
        </h2>
        <p className="text-gray-500 mb-6">
          本局得分：
          <span className="text-3xl font-black text-blue-500">{score}</span> 分
        </p>
        <div className="flex gap-3">
          <button
            onClick={onReplay}
            className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-full font-bold shadow hover:-translate-y-0.5 transition"
          >
            🔄 再玩一次
          </button>
          <button
            onClick={onHome}
            className="flex-1 py-3 bg-white border-2 border-sky-300 text-blue-500 rounded-full font-bold hover:bg-sky-50 transition"
          >
            🏠 回首页
          </button>
        </div>
      </div>
    </div>
  );
}

function GameBoard() {
  const router = useRouter();
  const params = useSearchParams();
  const playerName = params.get("name") ?? "玩家";

  const [board, setBoard] = useState<(Word | null)[]>([]);
  const [steps, setSteps] = useState(25);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "lose" | null>(null);

  const resetGame = useCallback(() => {
    setBoard(initBoard(GRADE3_UNIT1));
    setSteps(25);
    setScore(0);
    setSelected(null);
    setResult(null);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const checkEnd = useCallback(
    (newScore: number, newSteps: number) => {
      if (newScore >= 150) {
        saveScore(playerName, newScore);
        setResult("win");
      } else if (newSteps <= 0) {
        saveScore(playerName, newScore);
        setResult("lose");
      }
    },
    [playerName]
  );

  const handleClick = useCallback(
    (idx: number) => {
      if (result) return;
      if (board[idx] === null) return;

      // 取消选中
      if (selected === idx) {
        setSelected(null);
        return;
      }

      // 第一次选中
      if (selected === null) {
        setSelected(idx);
        return;
      }

      // 第二次点击 → 扣步数
      const newSteps = steps - 1;
      setSteps(newSteps);

      const first = board[selected]!;
      const second = board[idx]!;

      if (first.en === second.en) {
        // 相同 → 消除全场同类
        const word = first.en;
        let count = 0;
        const newBoard = board.map((cell) => {
          if (cell !== null && cell.en === word) {
            count++;
            return null;
          }
          return cell;
        });
        const newScore = score + count * 5;
        setBoard(newBoard);
        setScore(newScore);
        speak(word);
        setSelected(null);
        checkEnd(newScore, newSteps);
      } else {
        // 不同 → 切换选中
        setSelected(idx);
        checkEnd(score, newSteps);
      }
    },
    [board, selected, steps, score, result, checkEnd]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-5 w-full max-w-md">
        {/* 状态栏 */}
        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
          <span className="bg-emerald-400 text-white px-3 py-1.5 rounded-full text-sm font-bold">
            👤 {playerName}
          </span>
          <span className="bg-pink-400 text-white px-3 py-1.5 rounded-full text-sm font-bold">
            👣 {steps}步
          </span>
          <span className="bg-sky-400 text-white px-3 py-1.5 rounded-full text-sm font-bold">
            ⭐ {score}分
          </span>
        </div>

        {/* 进度提示 */}
        <div className="mb-3 text-center text-sm text-gray-400">
          目标：150分通关 &nbsp;·&nbsp; 当前：{score}/150
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-400 to-emerald-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((score / 150) * 100, 100)}%` }}
          />
        </div>

        {/* 棋盘 */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              disabled={cell === null}
              className={`
                aspect-square rounded-xl flex items-center justify-center
                text-xs sm:text-sm font-black text-white
                transition-all duration-150 select-none
                ${cell === null
                  ? "bg-transparent cursor-default"
                  : `${cell.color} hover:scale-105 cursor-pointer shadow-md active:scale-95`
                }
                ${selected === idx
                  ? "ring-4 ring-yellow-400 scale-110 shadow-xl"
                  : ""
                }
              `}
            >
              {cell?.en ?? ""}
            </button>
          ))}
        </div>

        {/* 返回 */}
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2 bg-white border-2 border-gray-200 text-gray-400 rounded-full text-sm hover:border-sky-300 hover:text-blue-400 transition"
        >
          ← 返回首页
        </button>
      </div>

      {/* 结算弹窗 */}
      {result && (
        <ResultModal
          win={result === "win"}
          score={score}
          onReplay={resetGame}
          onHome={() => router.push("/")}
        />
      )}
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-yellow-100 flex items-center justify-center"><div className="text-white text-2xl font-bold">加载中...</div></div>}>
      <GameBoard />
    </Suspense>
  );
}
