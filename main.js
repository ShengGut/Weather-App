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

const loadingContainer = document.getElementById('loading')
const searchForm = document.getElementById('searchForm')
const searchBox = document.getElementById('searchBox')
let location = 'London'

// Event listener checks location entered and calls getWeatherData if valid.
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const searchTerm = searchBox.value.trim()

  if (searchTerm.length === 0) {
    alert('Please enter a location.')
    return
  }

  const validCharsRegex = /^[a-zA-Z\s,'-]+$/
  if (!validCharsRegex.test(searchTerm)) {
    alert('Please enter a valid location name without any special characters.')
    return
  }

  console.log(searchTerm)
  if (searchTerm) {
    location = searchTerm
    getWeatherData()
  } else {
    alert(
      'Something went wrong with your search, please double check your location'
    )
  }
  searchBox.value = ''
})

async function getWeatherData() {
  const apiKey = import.meta.env.VITE_API_KEY
  const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}`

  try {
    loadingContainer.style.display = 'flex'
    const response = await fetch(apiURL, { mode: 'cors' })
    const weatherData = await response.json()

    if (weatherData.error) {
      // If the API returns an error, it means the location is invalid
      alert(`Error: ${weatherData.error.message}`)
      loadingContainer.style.display = 'none'
      return
    }

    console.log(weatherData)

    const dateString = weatherData.location.localtime
    const date = parse(dateString, 'yyyy-MM-dd HH:mm', new Date())
    const formattedDate = format(date, 'EEE, MMM d')

    if (weatherData) {
      locationName.innerHTML = `${weatherData.location.name} ${imageTag}`
      mainDate.textContent = formattedDate
      minTemp.textContent = `${Math.ceil(weatherData.forecast.forecastday[0].day.mintemp_f)}°F`
      maxTemp.textContent = `${Math.ceil(weatherData.forecast.forecastday[0].day.maxtemp_f)}°F`
      currentTemp.textContent = `${Math.ceil(weatherData.current.temp_f)}°F`
      humidityData.textContent = `${weatherData.forecast.forecastday[0].day.avghumidity}%`
      precipitationData.textContent = `${weatherData.forecast.forecastday[0].day.totalprecip_in}"`
      windData.textContent = `${weatherData.forecast.forecastday[0].day.maxwind_mph} mph`
    }
    loadingContainer.style.display = 'none'
  } catch (error) {
    console.log('Error fetching weather data: ', error)
  }
}
getWeatherData()
