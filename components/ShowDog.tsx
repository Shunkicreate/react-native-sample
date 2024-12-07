import React, { useState, useEffect } from "react";
import { View, Image, Button, StyleSheet } from "react-native";

const ShowDog: React.FC = () => {
  const [dogImage, setDogImage] = useState<string>("");

  const fetchDogImage = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();
      setDogImage(data.message);
    } catch (error) {
      console.error("Error fetching dog image:", error);
    }
  };

  useEffect(() => {
    fetchDogImage();
  }, []);

  return (
    <View style={styles.container}>
      {dogImage ? (
        <Image source={{ uri: dogImage }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Button title="犬ガチャ" onPress={fetchDogImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  placeholder: {
    width: 300,
    height: 300,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
});

export default ShowDog;
