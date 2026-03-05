import React, { useState, useEffect } from "react";
import { ScoreBoardProps } from "../types/cv.types";
import { Award, TrendingUp, AlertCircle } from "lucide-react";

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  tips,
  compact = false,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);

    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bon";
    if (score >= 40) return "Moyen";
    return "À améliorer";
  };

  // const circumference = 2 * Math.PI * 45;
  // const strokeDashoffset =
  //   circumference - (animatedScore / 100) * circumference;

  // const rootClasses = compact
  //   ? "flex items-center space-x-3 shrink-0"
  //   : "flex items-center space-x-4 bg-white rounded-lg p-4 shadow-sm border";

  // const svgSize = compact ? "w-12 h-12" : "w-24 h-24";
  // const numberSizeClass = compact ? "text-lg" : "text-2xl";
  // const labelClass = compact ? "text-xs" : "text-sm";

  return (
    <div
      className={
        compact
          ? "flex items-center space-x-2"
          : "flex items-center space-x-4 bg-white rounded-lg p-4 shadow-sm border"
      }
    >
      {/* Circular Progress */}
      <div
        className={`relative ${compact ? "w-10 h-10" : "w-24 h-24"} flex-shrink-0`}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            className="text-gray-200"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth={compact ? "3" : "2.5"}
          />
          {/* Progress circle */}
          <path
            className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth={compact ? "3" : "2.5"}
            strokeDasharray={`${animatedScore}, 100`}
            strokeLinecap="round"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`${compact ? "text-xs" : "text-2xl"} font-bold ${getScoreColor(score)}`}
          >
            {Math.round(animatedScore)}
          </span>
        </div>
      </div>

      {/* Score details */}
      <div className="flex-1 min-w-0">
        {!compact ? (
          <>
            <div className="flex items-center space-x-2 mb-1">
              <Award className={`w-5 h-5 ${getScoreColor(score)}`} />
              <span className="font-semibold text-gray-900">Score CV</span>
            </div>

            <div className={`text-sm font-medium mb-2 ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </div>

            {tips.length > 0 && (
              <div className="space-y-1">
                {tips.slice(0, 2).map((tip, index) => (
                  <div key={index} className="flex items-start space-x-1">
                    <AlertCircle className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600 truncate">
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Score
            </span>
            <span
              className={`text-sm font-bold truncate ${getScoreColor(score)}`}
            >
              {getScoreLabel(score)}
            </span>
          </div>
        )}
      </div>

      {/* Trend indicator (Standard only) */}
      {!compact && score > 70 && (
        <div className="flex items-center space-x-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Top</span>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
