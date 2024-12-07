import { Text, View } from "react-native";
import Counter from "@/app-example/components/Counter";
import ShowDog from "@/app-example/components/ShowDog";
import { Link, Stack } from 'expo-router';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/about">
        Go to About screen
      </Link>
      
      <Counter />
      <ShowDog />
    </View>
  );
}
