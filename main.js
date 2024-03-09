import './style.css'
import { parse, format } from 'date-fns'

const locationName = document.querySelector('.location')
const imageTag =
  '<img src="./images/locationpin.svg" id="locationpin-icon" alt="" />'
const minTemp = document.querySelector('.minTemp')
const maxTemp = document.querySelector('.maxTemp')
const currentTemp = document.querySelector('.currentTemp')
const mainDate = document.querySelector('.mainDate')

const weatherIcon = document.getElementById('weather-icon')
const humidityData = document.getElementById('humidityData')
const precipitationData = document.getElementById('precipitationData')
const windData = document.getElementById('windData')

// Write a function that fetches the Weather API, take a location, and return weather data for that location.
// console log the information
async function getWeatherData() {
  const apiKey = import.meta.env.VITE_API_KEY
  const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=London`

  try {
    const response = await fetch(apiURL, { mode: 'cors' })
    const weatherData = await response.json()
    console.log(weatherData)

    const dateString = weatherData.location.localtime
    const date = parse(dateString, 'yyyy-MM-dd HH:mm', new Date())
    const formattedDate = format(date, 'EEE, MMM d')

    if (weatherData) {
      locationName.innerHTML = `${weatherData.location.name} ${imageTag}`
      mainDate.textContent = formattedDate
      minTemp.textContent = `${weatherData.forecast.forecastday[0].day.mintemp_f}°F`
      maxTemp.textContent = `${weatherData.forecast.forecastday[0].day.maxtemp_f}°F`
      currentTemp.textContent = `${weatherData.current.temp_f}°F`
      humidityData.textContent = `${weatherData.forecast.forecastday[0].day.avghumidity}%`
      precipitationData.textContent = `${weatherData.forecast.forecastday[0].day.totalprecip_in}"`
      windData.textContent = `${weatherData.forecast.forecastday[0].day.maxwind_mph} mph`
    }
  } catch (error) {
    console.log('Error fetching weather data: ', error)
  }
}
getWeatherData()

// Afterwards, write a function that processes the JSON data from that API and return an object with only the data needed for the application

// Setup a form and use event listener that will fetch weather info for the location submitted
// Display that information on the application

// Should try to add a loading component that displays the time fetching the API.
