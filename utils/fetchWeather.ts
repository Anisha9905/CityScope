<<<<<<< HEAD
useEffect(() => {
  interface WeatherData {
    main: {
      temp: number
      humidity: number
    }
    weather: { main: string }[]
    wind: { speed: number }
  }

  async function fetchWeather() {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
      if (!API_KEY) {
        console.warn("OpenWeather API key not found")
        setWeather({ temp: "N/A", condition: "N/A", humidity: "N/A", windSpeed: "N/A" })
        return
      }

      const city = "Mangalore"
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      const data: WeatherData = await res.json()

      if (data.main && data.weather.length > 0 && data.wind) {
        setWeather({
          temp: `${Math.round(data.main.temp)}°C`,
          condition: data.weather[0].main,
          humidity: `${data.main.humidity}%`,
          windSpeed: `${data.wind.speed} m/s`,
        })
      } else {
        console.warn("Weather data incomplete:", data)
        setWeather({ temp: "N/A", condition: "N/A", humidity: "N/A", windSpeed: "N/A" })
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
      setWeather({ temp: "N/A", condition: "N/A", humidity: "N/A", windSpeed: "N/A" })
    }
  }

  fetchWeather()
  const interval = setInterval(fetchWeather, 10 * 60 * 1000) // every 10 mins
  return () => clearInterval(interval)
}, [])
=======
import axios from "axios"

const API_KEY = "6244b6aa16bc4ac20725f1f5d04fd885" // replace with your API key

export async function getWeather(city: string) {
  try {
    const response = await axios.get(
      https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}
    )
    const data = response.data
    return {
      temp: ${Math.round(data.main.temp)}°C,
      condition: data.weather[0].main,
      humidity: ${data.main.humidity}%,
      windSpeed: ${data.wind.speed} m/s,
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
>>>>>>> 32f7b27 (feat:fixed citizen chatbot and category)
