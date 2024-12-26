import React, { useState } from "react";
import { View, TextInput, Pressable, Text, Alert, Image, Animated } from "react-native";
import axios from "axios";
import Header from "../components/Header"; 

const HomeScreen = ({ navigation }) => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [fadeIn] = useState(new Animated.Value(0));

  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name.");
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db80d4e733b7a8b94d8aa0b2ed850742&units=metric`
      );
      setWeather(response.data);
   
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      Alert.alert("Error", "City not found!");
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-purple-700 to-indigo-900">
      <Header title="Weather App" />
      <View className="flex-1 justify-center items-center px-6">
        <TextInput
          className="border text-black border-gray-300 rounded-lg p-4 mb-4 w-full max-w-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="black" 
          keyboardType="default"
        />
        <Pressable
          className="bg-indigo-600 py-3 rounded-lg w-full max-w-md shadow-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-300"
          onPress={fetchWeather}
        >
          <Text className="text-center text-white font-semibold">Search</Text>
        </Pressable>

        {weather && (
          <Animated.View
            style={{
              opacity: fadeIn,
              transform: [{ translateY: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }}
            className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-md"
          >
            <Text className="text-xl font-bold text-black mb-2">
              {weather.name}, {weather.sys.country}
            </Text>
            <Text className="text-lg text-gray-700 mb-2">
              Temperature: {weather.main.temp}°C
            </Text>
            <Text className="text-base text-gray-600 mb-4">
              Description: {weather.weather[0].description}
            </Text>
            <View className="mb-4">
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`,
                }}
                style={{
                  width: 60,
                  height: 60,
                  transform: [{ rotate: "0deg" }],
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </View>

            <Pressable
              className="bg-indigo-600 py-3 rounded-lg"
              onPress={() =>
                navigation.navigate("Details", {
                  weather,
                  city: weather.name, // Passing city as part of the params
                })
              }
            >
              <Text className="text-center text-white font-semibold">
                View Details
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
