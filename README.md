# 06 Server-Side APIs: Weather Dashboard

## Header
The header was styled through css to have a linear-gradient with the text in the center

## Aside
In the aside section you will see a form that you can fill out with a city name.  The city name will be displayed on another section.  Using the API Url `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` and an API Key, the page can fetch the weather data that matches what was submitted.  It will show the name of the city, the date, an icon that represents the current climate, the temperature, humidity, and windspeed.

```
 function displayWeatherData(data) {
    const cityName = data.name;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherDescription = data.weather[0].main; // Extract weather description from data

    const weatherIconClass = weatherIcons[weatherDescription] || 'fas fa-question'; // Default icon if no match found
    console.log(`weather description:`, weatherDescription);
    const iconElement = `<i class="${weatherIconClass}"></i>`; // Create icon element


    const weatherInfo = `
    <h2>Weather in ${cityName} - ${formattedDate} <i class="${weatherIconClass}"></i></h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>`;

    document.getElementById('weather-results').innerHTML = weatherInfo; }
```


Using the .then promise; the user will recieve an error prompt if the page takes too long to load or an alert if the input is invalid.

```
{
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching weather data. Please try again later.');
        });
}

```
- code was revised usind chatGPT


A list was made to display user search history by pushing it into an array at the global scope.  When the user clicks on a previous search result, the weather information is displayed, and the search history is updated.

## Forecast
As the weather information is displayed, the user will be shown a five day forcast of the weather in the city.  Using a similar code to the city-weather information, we added a datekey to stop duplications from populating the site.

```
 forecastMap.set(dateKey, true);
```
- code was made with the help of chatGPT

https://luislaplace.github.io/Its-the-Weather/

https://github.com/LuisLaplace/Its-the-Weather