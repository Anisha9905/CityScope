import axios from "axios"

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY" // replace with your API key

export async function getWeather(city: string) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
    const data = response.data
    return {
      temp: `${Math.round(data.main.temp)}°C`,
      condition: data.weather[0].main,
      humidity: `${data.main.humidity}%`,
      windSpeed: `${data.wind.speed} m/s`,
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
