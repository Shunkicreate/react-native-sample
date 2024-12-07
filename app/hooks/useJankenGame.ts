import { useState, useEffect } from "react";
import { ChoiceType, choices } from "@/app/types/models";

export const useJankenGame = (
  onBackClick: () => void,
  playerChoices: ChoiceType[]
) => {
  const [computerChoices, setComputerChoices] = useState<ChoiceType[]>([]);
  const [playerChoicesState, setPlayerChoicesState] =
    useState<ChoiceType[]>(playerChoices);
  const [showScoreWindow, setShowScoreWindow] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<{
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
  } | null>(null);
  const [life, setLife] = useState<number>(5);
  const [winCount, setWinCount] = useState<number>(0);
  const [drawCount, setDrawCount] = useState<number>(0);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [enemyImage, setEnemyImage] = useState<string>(
    "../../assets/robot1_blue.png"
  );
  const enemyImages = [
    require("../../assets/robot1_blue.png"),
    require("../../assets/robot2_green.png"),
    require("../../assets/robot3.png"),
    require("../../assets/robot4_orange.png"),
    require("../../assets/robot5_red.png"),
    require("../../assets/robot6_purple.png"),
  ];

  // ゲーム結果の判定
  const getResult = (
    player: ChoiceType,
    computer: ChoiceType
  ): "win" | "lose" | "draw" => {
    if (
      player.name === computer.name ||
      player.name === "バリアー" ||
      computer.name === "バリアー"
    )
      return "draw";
    if (
      (player.type === "rock" && computer.type === "scissors") ||
      (player.type === "scissors" && computer.type === "paper") ||
      (player.type === "paper" && computer.type === "rock")
    ) {
      return "win";
    }
    if (player.level > computer.level && player.type === computer.type) {
      return "win";
    }
    return "lose";
  };

  const getRandomChoices = (
    array: ChoiceType[],
    count: number
  ): ChoiceType[] => {
    const shuffled = array.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getRandomEnemyImage = () => {
    const randomImage =
      enemyImages[Math.floor(Math.random() * enemyImages.length)];
    setEnemyImage(randomImage);
  };

  useEffect(() => {
    if (computerChoices.length === 0) {
      setComputerChoices(getRandomChoices(choices, 3));
    }
  }, []);

  const handlePlayerChoice = (playerIndex: number) => {
    const randomComputerIndex = Math.floor(
      Math.random() * computerChoices.length
    );
    const playerChoice = playerChoicesState[playerIndex];
    const computerChoice = computerChoices[randomComputerIndex];
    const result = getResult(playerChoice, computerChoice);

    const updatedPlayerChoices = [...playerChoicesState];
    const updatedComputerChoices = [...computerChoices];

    updatedPlayerChoices[playerIndex] = computerChoice;
    updatedComputerChoices[randomComputerIndex] = playerChoice;

    setPlayerChoicesState(updatedPlayerChoices);
    setComputerChoices(updatedComputerChoices);

    if (result === "win") {
      setWinCount(winCount + 1);
      setDrawCount(0);
    } else if (result === "lose") {
      setLife(life - 1);
      setDrawCount(0);
    } else {
      setDrawCount(drawCount + 1);
    }

    setShowResult({ playerChoice, computerChoice, result });
  };

  const resetGame = () => {
    setPlayerChoicesState(playerChoices);
    setComputerChoices(getRandomChoices(choices, 3));
    setLife(5);
    setWinCount(0);
    setDrawCount(0);
    getRandomEnemyImage();
  };

  const closeScoreWindow = () => {
    setShowScoreWindow(false);
    onBackClick();
  };

  return {
    computerChoices,
    playerChoicesState,
    showResult,
    showScoreWindow,
    life,
    winCount,
    isShuffling,
    enemyImage,
    handlePlayerChoice,
    resetGame,
    closeScoreWindow,
  };
};
