import React from "react";
import JankenCard from "./JankenCard";
// import "./ResultWindow.css";
import { ChoiceType } from "@/app/types/models";
import { View } from "react-native";

interface ResultWindowProps {
  showResult: {
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
  } | null;
  drawCount: number;
  closeResult: () => void;
}

const ResultWindow: React.FC<ResultWindowProps> = ({
  showResult,
  drawCount,
  closeResult,
}) => {
  if (!showResult) return null;

  const backgroundColor = "#d3d3d3";

  return (
    <View className="overlay">
    {/* <View className="overlay" onClick={closeResult}> */}
      <View className="result-window" style={{ backgroundColor }}>
        <View className="result-container">
          {/* 相手の手 */}
          <View className="choice choice-computer">
            <JankenCard
              choice={showResult.computerChoice}
              onClick={() => {}}
              onRightClick={() => {}}
            />
          </View>
        </View>

        <p className="result-text">
          {showResult.result === "win"
            ? "WIN"
            : showResult.result === "lose"
            ? "LOSE"
            : `あいこ${drawCount > 0 ? `（${drawCount}/3）` : "3/3"}`}
        </p>

        <View className="result-icon">
          {(showResult.result === "win" || showResult.result === "reset") && (
            <span className="star-icon">
              ★<span className="plus-minus">+1</span>
            </span>
          )}
          {showResult.result === "lose" && (
            <span className="heart-icon">
              ❤<span className="plus-minus">-1</span>
            </span>
          )}
        </View>

        <View className="choice choice-player">
          <JankenCard
            choice={showResult.playerChoice}
            onClick={() => {}}
            onRightClick={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

export default ResultWindow;
