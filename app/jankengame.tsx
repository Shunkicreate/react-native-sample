import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import ScoreWindow from "@/components/ScoreWindow";
import ResultWindow from "@/components/ResultWindow";
import JankenCard from "@/components/JankenCard";
import { ChoiceType, choices } from "@/app/types/models";

interface JankenGameProps {
  onBackClick: () => void;
  playerChoices: ChoiceType[];
}

function getResult(
  player: ChoiceType,
  computer: ChoiceType
): "win" | "lose" | "draw" {
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
}

const enemyImages = [
  require("../assets/robot1_blue.png"),
  require("../assets/robot2_green.png"),
  require("../assets/robot3.png"),
  require("../assets/robot4_orange.png"),
  require("../assets/robot5_red.png"),
  require("../assets/robot6_purple.png"),
];

export default function JankenGame({
  onBackClick,
  playerChoices,
}: JankenGameProps) {
  console.log("choices:", choices);
  const [computerChoices, setComputerChoices] = useState<ChoiceType[]>([]);

  const [showDescription, setShowDescription] = useState<string | null>(null);
  const [playerChoicesState, setPlayerChoicesState] =
    useState<ChoiceType[]>(playerChoices);
  const [showResult, setShowResult] = useState<{
    playerChoice: ChoiceType;
    computerChoice: ChoiceType;
    result: string;
  } | null>(null);
  const [showScoreWindow, setShowScoreWindow] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const [life, setLife] = useState<number>(5);
  const [winCount, setWinCount] = useState<number>(0);
  const [drawCount, setDrawCount] = useState<number>(0);
  const [animateLife, setAnimateLife] = useState<boolean>(false);
  const [slidingInIndex, setSlidingInIndex] = useState<number | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [enemyImage, setEnemyImage] = useState<any>(enemyImages[0]);
  const [isEnemyImageAnimating, setIsEnemyImageAnimating] = useState(false);

  useEffect(() => {
    setAnimateLife(true);
    const timer = setTimeout(() => setAnimateLife(false), 400);
    return () => clearTimeout(timer);
  }, [life]);

  const getRandomChoices = (
    array: ChoiceType[],
    count: number,
    winCount: number
  ): ChoiceType[] => {
    const otherWeight = 100;
    const midWeight = Math.min(150, Math.max(30 * (winCount - 2), 0));
    const bigWeight = Math.min(200, Math.max(0, 60 * (winCount - 10)));
    const barrierWeight = Math.max(
      15,
      Math.min(otherWeight, midWeight, bigWeight)
    );

    const weightedArray = [
      ...Array(otherWeight).fill(
        array.find((choice) => choice.name === "グー")
      ),
      ...Array(otherWeight).fill(
        array.find((choice) => choice.name === "チョキ")
      ),
      ...Array(otherWeight).fill(
        array.find((choice) => choice.name === "パー")
      ),
      ...Array(barrierWeight).fill(
        array.find((choice) => choice.name === "バリアー")
      ),
      ...Array(bigWeight).fill(array.find((choice) => choice.name === "村正")),
      ...Array(bigWeight).fill(array.find((choice) => choice.name === "隕石")),
      ...Array(bigWeight).fill(array.find((choice) => choice.name === "愛")),
      ...Array(midWeight).fill(
        array.find((choice) => choice.name === "ザリガニ")
      ),
      ...Array(midWeight).fill(
        array.find((choice) => choice.name === "金の玉")
      ),
      ...Array(midWeight).fill(array.find((choice) => choice.name === "札")),
    ].filter(Boolean) as ChoiceType[];

    const shuffled = weightedArray.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getRandomEnemyImage = () => {
    const randomImage =
      enemyImages[Math.floor(Math.random() * enemyImages.length)];
    setEnemyImage(randomImage);
  };

  useEffect(() => {
    if (computerChoices.length === 0) {
      setComputerChoices(getRandomChoices(choices, 3, winCount));
    }
  }, [computerChoices, winCount]);

  const handlePlayerChoice = (playerIndex: number) => {
    const randomComputerIndex = Math.floor(
      Math.random() * computerChoices.length
    );

    const playerChoice = playerChoicesState[playerIndex];
    const computerChoice = computerChoices[randomComputerIndex];

    const result = getResult(playerChoice, computerChoice);

    const newPlayerChoices = [...playerChoicesState];
    const newComputerChoices = [...computerChoices];

    newPlayerChoices[playerIndex] = computerChoice;
    newComputerChoices[randomComputerIndex] = playerChoice;

    setPlayerChoicesState(newPlayerChoices);
    setComputerChoices(newComputerChoices);

    setSelectedCardIndex(playerIndex);

    if (result === "win") {
      setWinCount((prev) => prev + 1);
      setDrawCount(0);
    } else if (result === "lose") {
      setLife((prev) => prev - 1);
      setDrawCount(0);
    } else if (result === "draw") {
      setDrawCount((prev) => prev + 1);
      if (drawCount + 1 >= 3) {
        setWinCount((prev) => prev + 1);
        setDrawCount(0);
        setShowResult({ playerChoice, computerChoice, result: "reset" });
        return;
      }
    }

    setShowResult({ playerChoice, computerChoice, result });

    if (result !== "draw") {
      setIsShuffling(true);
      setIsShuffling(false);
    }
  };

  const handleRightClick = (event: any, description: string) => {
    event.preventDefault();
    setShowDescription(description);
  };

  const closeScoreWindow = () => {
    setShowScoreWindow(false);
    onBackClick();
  };

  const closeDescription = () => setShowDescription(null);

  const closeResult = () => {
    setShowResult(null);
    if (selectedCardIndex !== null) {
      setSlidingInIndex(selectedCardIndex);
      setTimeout(() => setSlidingInIndex(null), 600);
      setSelectedCardIndex(null);
    }

    if (drawCount === 0) {
      getRandomEnemyImage();
      setIsEnemyImageAnimating(true);
      setIsShuffling(true);
      setTimeout(() => {
        setComputerChoices(getRandomChoices(choices, 3, winCount));
        setTimeout(() => setIsShuffling(false), 600);
        setTimeout(() => setIsEnemyImageAnimating(false), 600);
      }, 100);
    }

    if (life <= 0) {
      setTimeout(() => setShowScoreWindow(true), 100);
    }

    if (slidingInIndex !== null) {
      setTimeout(() => setSlidingInIndex(null), 600);
    }
  };

  const handleForfeit = () => {
    setLife(0);
    setShowScoreWindow(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="降参" onPress={handleForfeit} />
        <Text style={styles.headerText}>Trading Janken</Text>
      </View>

      <View style={styles.enemyContainer}>
        <Text style={styles.enemyText}>ランダムロボ</Text>
        <Image source={enemyImage} style={styles.enemyImage} />
      </View>

      <View style={styles.cardContainer}>
        {(computerChoices || []).map((choice, index) => (
          <View key={index} style={isShuffling ? styles.computerCard : null}>
            <JankenCard
              choice={choice}
              onClick={() => {}}
              onRightClick={(event) =>
                handleRightClick(event, choice.description)
              }
            />
          </View>
        ))}
      </View>

      <View style={styles.cardContainer}>
        {(playerChoicesState || []).map((choice: ChoiceType, index: number) => (
          <JankenCard
            key={`player-${index}`}
            choice={choice}
            onClick={() => handlePlayerChoice(index)}
            onRightClick={(event: React.MouseEvent | React.TouchEvent) =>
              handleRightClick(event, choice.description)
            }
            isPlayerHand={true}
            className={slidingInIndex === index ? "card-slide-in" : ""}
          />
        ))}
      </View>

      <View style={styles.playerContainer}>
        <Image
          source={require("../assets/player.png")}
          style={styles.playerImage}
        />
        <View style={styles.playerInfo}>
          <Text style={styles.playerText}>You</Text>
          <View style={styles.lifeContainer}>
            {Array.from({ length: life }).map((_, index) => (
              <Text
                key={index}
                style={animateLife ? styles.heartAnimate : styles.heart}
              >
                ❤
              </Text>
            ))}
          </View>
          <View style={styles.winContainer}>
            <Text style={styles.star}>★</Text> × {winCount}
          </View>
        </View>
      </View>

      <Text style={styles.instructionText}>
        カードを確認：右クリック（PC）、長押し（スマホ）
      </Text>

      <Modal
        visible={!!showDescription}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={closeDescription}
        >
          <View style={styles.modalContent}>
            <Text>{showDescription}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      <ResultWindow
        showResult={showResult}
        drawCount={drawCount}
        closeResult={closeResult}
      />

      <Modal visible={showScoreWindow} transparent={true} animationType="slide">
        <ScoreWindow winCount={winCount} closeScoreWindow={closeScoreWindow} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  header: {
    width: "100%",
    backgroundColor: "black",
    color: "white",
    padding: 10,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerText: {
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
  },
  enemyContainer: {
    display: "flex",
    alignItems: "center",
    transform: [{ translateX: 20 }],
  },
  enemyText: {
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 5,
  },
  enemyImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  cardContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  computerCard: {
    // Add styles for computer card if needed
  },
  playerContainer: {
    display: "flex",
    alignItems: "center",
    transform: [{ translateX: -50 }],
  },
  playerImage: {
    width: "20%",
    height: "15%",
    resizeMode: "contain",
  },
  playerInfo: {
    borderLeftWidth: 0,
    paddingLeft: 30,
    marginLeft: -20,
    color: "black",
    width: 100,
    textAlign: "left",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  playerText: {
    fontWeight: "bold",
  },
  lifeContainer: {
    margin: -5,
  },
  heart: {
    // Add styles for heart if needed
  },
  heartAnimate: {
    // Add styles for heart animation if needed
  },
  winContainer: {
    margin: -5,
  },
  star: {
    // Add styles for star if needed
  },
  instructionText: {
    // Add styles for instruction text if needed
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxWidth: "80%",
    textAlign: "center",
  },
});
