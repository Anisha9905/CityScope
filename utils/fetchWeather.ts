import axios from "axios"

const API_KEY = "6244b6aa16bc4ac20725f1f5d04fd885"

export async function getWeather(city: string) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
    const data = response.data
    return {
      temp: `${Math.round(data.main.temp)}°C`,
      condition: data.weather?.[0]?.main || "N/A",
      humidity: `${data.main?.humidity ?? "N/A"}%`,
      windSpeed: `${data.wind?.speed ?? "N/A"} m/s`,
    }
  } catch (error) {
    console.error("Error fetching weather:", error)
    return {
      temp: "N/A",
      condition: "N/A",
      humidity: "N/A",
      windSpeed: "N/A",
    }
  }
}
