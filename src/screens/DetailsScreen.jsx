import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import Header from "../components/Header";

const DetailsScreen = ({ route }) => {
  const { weather, city } = route.params || {};
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "db80d4e733b7a8b94d8aa0b2ed850742";
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`;

  useEffect(() => {
    const fetchForecastData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(forecastUrl);
        setForecastData(response.data.list);
      } catch (error) {
        setError("Failed to fetch forecast data.");
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchForecastData();
    }
  }, [city]);

  if (!weather) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-200 to-blue-500">
        <Text className="text-lg text-red-500 font-bold">No details available.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-300 to-blue-500">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-lg text-white mt-4">Loading forecast data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-300 to-blue-500">
        <Text className="text-lg text-red-500 font-bold">{error}</Text>
        <TouchableOpacity
          onPress={() => setError(null)}
          className="bg-red-500 px-6 py-3 rounded-full mt-4"
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const processForecast = () => {
    const dailyForecast = [];
    let lastDate = "";

    forecastData.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      if (date !== lastDate) {
        dailyForecast.push({
          date,
          temp: item.main.temp,
          weather: item.weather[0].description,
          icon: item.weather[0].icon,
          windSpeed: item.wind.speed,
        });
        lastDate = date;
      }
    });

    return dailyForecast.slice(0, 5);
  };

  const dailyForecastData = processForecast();

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-300 to-blue-600">
      <Header showBackButton={true} title="Weather Details" />
      <View className="p-6">
        {/* Weather Metrics */}
        <View className="mb-6 bg-white rounded-lg p-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-700 mb-2">🌫️ Humidity: {weather.main.humidity}%</Text>
          <Text className="text-lg font-semibold text-gray-700 mb-2">🌬️ Wind Speed: {weather.wind.speed} m/s</Text>
          <Text className="text-lg font-semibold text-gray-700 mb-2">🌡️ Feels Like: {weather.main.feels_like}°C</Text>
          <Text className="text-xl font-bold text-gray-800">{city}</Text>
        </View>

        {/* Forecast Section */}
        <Text className="text-xl font-bold text-black mb-4">5-Day Forecast</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3 space-x-4"
        >
          {dailyForecastData.length > 0 ? (
            dailyForecastData.map((day, index) => (
              <View
                key={index}
                className="bg-white p-4 rounded-lg shadow-md w-56"
              >
                <Text className="text-lg font-bold text-gray-800">{day.date}</Text>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${day.icon}.png`,
                  }}
                  style={{ width: 50, height: 50, marginVertical: 8 }}
                />
                <Text className="text-gray-700">🌡 Temp: {day.temp}°C</Text>
                <Text className="text-gray-700">🌤 Weather: {day.weather}</Text>
                <Text className="text-gray-700">🌬 Wind: {day.windSpeed} m/s</Text>
              </View>
            ))
          ) : (
            <Text className="text-red-500">No forecast data available.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default DetailsScreen;
