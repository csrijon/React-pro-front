"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, RotateCcw, Check, AlertCircle } from "lucide-react";
import { soundFX } from "./CyberAudioFx";

interface CyberCaptchaProps {
  onVerified: (token: string) => void;
  onReset?: () => void;
}

export default function CyberCaptcha({ onVerified, onReset }: CyberCaptchaProps) {
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(7);
  const [operator, setOperator] = useState<"+" | "*">("+");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);

  const generateChallenge = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    const op = Math.random() > 0.6 ? "*" : "+";
    setNum1(n1);
    setNum2(n2);
    setOperator(op as "+" | "*");
    setUserInput("");
    setIsVerified(false);
    setHasError(false);
    if (onReset) onReset();
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const expectedAnswer = operator === "+" ? num1 + num2 : num1 * num2;

  const handleInputChange = (val: string) => {
    setUserInput(val);
    const parsed = parseInt(val.trim(), 10);

    if (parsed === expectedAnswer) {
      setIsVerified(true);
      setHasError(false);
      soundFX.success();
      // Generate client verification token
      const token = btoa(`verified_${expectedAnswer}_${Date.now()}`);
      onVerified(token);
    } else {
      setIsVerified(false);
      if (val.trim().length >= expectedAnswer.toString().length) {
        setHasError(true);
      } else {
        setHasError(false);
      }
    }
  };

  return (
    <div className="p-3.5 rounded-2xl glass-panel border border-cyan-500/30 bg-cyber-950/60 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Human Verification Security Check</span>
        </span>
        <button
          type="button"
          onClick={() => {
            soundFX.click();
            generateChallenge();
          }}
          className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Refresh Captcha"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Security Challenge Box */}
        <div className="relative h-11 min-h-[44px] px-4 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center select-none font-mono font-bold text-sm tracking-wider overflow-hidden shrink-0">
          {/* Subtle noise line */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          <span className="text-cyan-400 transform -rotate-3 inline-block">{num1}</span>
          <span className="text-purple-400 mx-2">{operator === "+" ? "+" : "×"}</span>
          <span className="text-emerald-400 transform rotate-3 inline-block">{num2}</span>
          <span className="text-gray-400 ml-2">=</span>
        </div>

        {/* User Input */}
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="Answer"
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isVerified}
            className={`w-full h-11 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-mono text-center font-bold tracking-wider focus:outline-none transition-all ${
              isVerified
                ? "bg-emerald-500/15 border border-emerald-400 text-emerald-300"
                : hasError
                ? "bg-rose-500/15 border border-rose-500 text-rose-300"
                : "bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
            }`}
          />

          {isVerified && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500 text-gray-950 flex items-center justify-center shadow-sm">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {hasError && !isVerified && (
        <div className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
          <AlertCircle className="w-3 h-3" />
          <span>Incorrect answer. Please solve the calculation to submit.</span>
        </div>
      )}

      {isVerified && (
        <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
          <Check className="w-3 h-3" />
          <span>Anti-Bot Verification Passed!</span>
        </div>
      )}
    </div>
  );
}
