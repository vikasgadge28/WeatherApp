import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, showBackButton = false, }) => {
  const navigation = useNavigation();

  return (
    <View className="bg-indigo-600 py-4 px-6 flex-row items-center justify-between">
      {/* Back Button */}
      {showBackButton ? (
        <Pressable
          onPress={() => navigation.goBack()}
          className="px-3 py-1 rounded-full bg-indigo-500 shadow-md"
        >
          <Text className="text-white font-medium">⬅ Back</Text>
        </Pressable>
      ) : (
        <View className="w-12" /> // Placeholder for spacing
      )}

      {/* Title */}
      <Text className="text-white text-xl font-bold flex-1 text-center">
        {title}
      </Text>

    
    </View>
  );
};

export default Header;
