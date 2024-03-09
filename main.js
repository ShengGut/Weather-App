import './style.css'

// Write a function that fetches the Weather API, take a location, and return weather data for that location.
// console log the information
async function getWeatherData() {
  const apiKey = import.meta.env.VITE_API_KEY
  const apiURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=London`

  try {
    //  const response = await fetch(apiURL, { mode: 'cors' })
    //   const weatherData = await response.json()
    //   console.log(weatherData)
    if (weatherData) {
      //     console.log('Location:', weatherData.location.name)
      console.log(
        'Min Temperature (F):'
        //   weatherData.forecast.forecastday[0].day.mintemp_f
      )
      console.log(
        'Max Temperature (F):'
        //   weatherData.forecast.forecastday[0].day.maxtemp_f
      )
      console.log(
        'Average humidity (%):'
        //   weatherData.forecast.forecastday[0].day.avghumidity
      )
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
