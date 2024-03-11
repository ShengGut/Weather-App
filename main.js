import './style.css'
import { parse, format } from 'date-fns'

const DOM_ELEMENTS = {
  locationName: document.querySelector('.location'),
  minTemp: document.querySelector('.minTemp'),
  maxTemp: document.querySelector('.maxTemp'),
  currentTemp: document.querySelector('.currentTemp'),
  mainDate: document.querySelector('.mainDate'),
  weatherIcon: document.getElementById('weather-icon'),
  humidityData: document.getElementById('humidityData'),
  precipitationData: document.getElementById('precipitationData'),
  windData: document.getElementById('windData'),
  loadingContainer: document.getElementById('loading'),
  searchForm: document.getElementById('searchForm'),
  searchBox: document.getElementById('searchBox'),
}

const CONSTANTS = {
  LOCATION_PIN_ICON:
    '<img src="./images/locationpin.svg" id="locationpin-icon" alt="" />',
  CACHE_EXPIRATION_TIME: 3600000, // 1 hour in milliseconds
}

let location = localStorage.getItem('location') || 'New York'

// event listener checks location entered and calls getWeatherData if valid.
DOM_ELEMENTS.searchForm.addEventListener('submit', handleSearchSubmit)

async function handleSearchSubmit(event) {
  event.preventDefault()
  const searchTerm = DOM_ELEMENTS.searchBox.value.trim()

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
    await getWeatherData()
  } else {
    alert(
      'Something went wrong with your search, please double check your location'
    )
  }
  DOM_ELEMENTS.searchBox.value = ''
}

async function getWeatherData() {
  const apiKey = import.meta.env.VITE_API_KEY
  const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}`

  try {
    const cachedData = localStorage.getItem('weatherData')
    const cachedTimestamp = localStorage.getItem('weatherTimestamp')
    const currentTimestamp = Date.now()
    const cachedLocation = localStorage.getItem('location')

    // loads cached data only if it is cached less than 1 hour from it's creation
    if (
      cachedData &&
      cachedTimestamp &&
      cachedLocation === location &&
      currentTimestamp - cachedTimestamp < CONSTANTS.CACHE_EXPIRATION_TIME
    ) {
      const weatherData = JSON.parse(cachedData)
      console.log(`Successfully loaded cached weather data!`, weatherData)
      displayWeatherData(weatherData)
      return
    }

    DOM_ELEMENTS.loadingContainer.style.display = 'flex'

    // if cached data fails to load, call API
    const response = await fetch(apiURL, { mode: 'cors' })
    const weatherData = await response.json()
    console.log(`Call to API for weather data `, weatherData)
    if (weatherData.error) {
      // if the API returns an error, it means the location is invalid
      alert(`Error: ${weatherData.error.message}`)
      DOM_ELEMENTS.loadingContainer.style.display = 'none'
      return
    }

    // store the new data in localStorage with the current timestamp
    localStorage.setItem('weatherData', JSON.stringify(weatherData))
    localStorage.setItem('weatherTimestamp', currentTimestamp)
    localStorage.setItem('location', location)
    displayWeatherData(weatherData)
    DOM_ELEMENTS.loadingContainer.style.display = 'none'
  } catch (error) {
    console.log('Error fetching weather data: ', error)
  }
}

function displayWeatherData(weatherData) {
  const dateString = weatherData.location.localtime
  const date = parse(dateString, 'yyyy-MM-dd HH:mm', new Date())
  const formattedDate = format(date, 'EEE, MMM d')

  if (weatherData) {
    DOM_ELEMENTS.locationName.innerHTML = `${weatherData.location.name} ${CONSTANTS.LOCATION_PIN_ICON}`
    DOM_ELEMENTS.mainDate.textContent = formattedDate
    DOM_ELEMENTS.minTemp.textContent = `${Math.ceil(weatherData.forecast.forecastday[0].day.mintemp_f)}°F`
    DOM_ELEMENTS.maxTemp.textContent = `${Math.ceil(weatherData.forecast.forecastday[0].day.maxtemp_f)}°F`
    DOM_ELEMENTS.currentTemp.textContent = `${Math.ceil(weatherData.current.temp_f)}°F`
    DOM_ELEMENTS.humidityData.textContent = `${weatherData.forecast.forecastday[0].day.avghumidity}%`
    DOM_ELEMENTS.precipitationData.textContent = `${weatherData.forecast.forecastday[0].day.totalprecip_in}"`
    DOM_ELEMENTS.windData.textContent = `${weatherData.forecast.forecastday[0].day.maxwind_mph} mph`
  }
}

getWeatherData()
