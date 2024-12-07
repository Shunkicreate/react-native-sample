import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Link } from 'expo-router';

interface ScoreWindowProps {
  winCount: number;
  closeScoreWindow: () => void;
}

const ScoreWindow: React.FC<ScoreWindowProps> = ({
  winCount,
  closeScoreWindow,
}) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 送信中フラグ

  // スコアをサーバーに送信する関数
  const submitScore = async () => {
    if (playerName.trim() === "") {
      setErrorMessage("名前を入力してください");
      return;
    }

    setIsSubmitting(true); // 送信中に設定
    const payload = { user_name: playerName, score: winCount };

    try {
      const response = await fetch("/api/tj-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // スコア送信が成功したらタイトル画面に戻る
        closeScoreWindow();
      } else {
        console.error("Failed to submit score");
      }
    } catch (error) {
      console.error("An error occurred while submitting the score", error);
    } finally {
      setIsSubmitting(false); // 送信完了後にリセット
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          maxWidth: "80%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Score</Text>
        <Text style={{ fontSize: 32, fontWeight: "bold", margin: 20 }}>
          {winCount}
        </Text>
        <TextInput
          placeholder="名前を入力してください"
          value={playerName}
          onChangeText={(text) => {
            setPlayerName(text);
            setErrorMessage(""); // テキスト変更時にエラーメッセージをクリア
          }}
          style={{ padding: 10, margin: 10, width: "90%" }}
          editable={!isSubmitting} // 送信中は入力無効
        />
        {errorMessage ? (
          <Text style={{ color: "red", marginTop: 5 }}>{errorMessage}</Text>
        ) : null}
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
            <Link href="/">
                トップに戻る
            </Link>
          {/* <Button
            onClick={submitScore}
            style={{
              padding: "10px",
              width: "90%",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: isSubmitting ? "#ccc" : "#555555",
              color: "white",
              border: "none",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "スコアを登録"}
          </Button>
          <Button
            onClick={closeScoreWindow}
            style={{
              marginTop: "10px",
              padding: "10px",
              width: "90%",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "#a9a9a9",
              color: "white",
              border: "none",
            }}
            disabled={isSubmitting}
          >
            登録せずに戻る
          </Button> */}
        </View>
      </View>
    </View>
  );
};

export default ScoreWindow;
