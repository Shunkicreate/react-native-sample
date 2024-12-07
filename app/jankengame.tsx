import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import JankenCard from "@/components/JankenCard";
import ResultWindow from "@/components/ResultWindow";
import ScoreWindow from "@/components/ScoreWindow";
import { useJankenGame } from "./hooks/useJankenGame";
import { ChoiceType } from "./types/models";

export default function JankenGame({
  onBackClick,
}: {
  onBackClick: () => void;
  playerChoices: ChoiceType[];
}) {
  const {
    computerChoices,
    playerChoices,
    showResult,
    showScoreWindow,
    life,
    winCount,
    isShuffling,
    enemyImage,
    handlePlayerChoice,
    resetGame,
    closeScoreWindow,
    closeResult,
  } = useJankenGame(onBackClick);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button title="降参" onPress={resetGame} />
        <Text style={styles.headerText}>Trading Janken</Text>
      </View>

      {/* Enemy Section */}
      <View style={styles.enemyContainer}>
        <Text style={styles.enemyText}>ランダムロボ</Text>
        <Image source={enemyImage as any} style={styles.enemyImage} />
      </View>

      {/* Computer Cards */}
      <View style={styles.cardContainer}>
        <Text style={styles.enemyText}>相手の手</Text>
        {(computerChoices || []).map((choice, index) => (
          <JankenCard
            key={index}
            choice={choice}
            onClick={() => {}}
            onRightClick={() => {}}
          />
        ))}
      </View>

      {/* Player Cards */}
      <View style={styles.cardContainer}>
        <Text style={styles.enemyText}>あなたの手</Text>
        {(playerChoices || []).map((choice, index) => (
          <JankenCard
            key={index}
            choice={choice}
            onClick={() => handlePlayerChoice(index)}
            onRightClick={() => {}}
            isPlayerHand
          />
        ))}
      </View>

      {/* Player Info */}
      <View style={styles.playerContainer}>
        <Text style={styles.playerText}>ライフ: {life}</Text>
        <Text style={styles.playerText}>勝利数: {winCount}</Text>
      </View>

      {/* Result Modal */}
      {showResult && (
        <Modal transparent>
          <ResultWindow
            showResult={showResult}
            closeResult={closeResult}
            drawCount={0}
          />
        </Modal>
      )}

      {showScoreWindow && (
        <ScoreWindow winCount={winCount} closeScoreWindow={closeScoreWindow} />
      )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
  },
  enemyContainer: {
    display: "flex",
    alignItems: "center",
    margin: 10,
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
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  playerContainer: {
    marginTop: 20,
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
    fontSize: 16,
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
