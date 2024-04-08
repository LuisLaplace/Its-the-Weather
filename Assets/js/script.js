const API_KEY = '58d09628a194f1e8f1ecf12b1d580c14';
const searchHistory = []; // Array to store searched cities

const weatherIcons = {
    'Clear': 'fa-solid fa-moon', 
    'Clouds': 'fa-solid fa-cloud',
    'Rain': 'fa-solid fa-umbrella',
    'Sunny': 'fa-soldi fa-sun',
    'few clouds': 'fa-solid fa-cloud-moon',
};

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const city = document.getElementById('city').value.trim();

    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

function getWeatherData(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

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

    document.getElementById('weather-results').innerHTML = weatherInfo; // Update weather-results section

    // Get 5-day forecast data
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
            fetch(forecastURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(forecastData => {
                    displayForecastData(forecastData);
                })
                .catch(error => {
                    console.error('Error fetching forecast data:', error);
                    alert('Error fetching forecast data. Please try again later.');
                });
}

function displayForecastData(forecastData) {
    const forecastList = forecastData.list;
    const forecastContainer = document.getElementById('forecast');

    let forecastHTML = '<h3>5-Day Forecast:</h3>';
    const forecastMap = new Map(); // Use a Map to store unique forecast entries by date

    // Filter forecast data to include only one entry per day
    forecastList.forEach(item => {
        const forecastDate = new Date(item.dt * 1000); // Convert Unix timestamp to milliseconds
        const dateKey = forecastDate.toDateString(); // Use date string as key in the map

        // Check if the map already contains an entry for this date
        if (!forecastMap.has(dateKey)) {
            const formattedDate = forecastDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const temperature = item.main.temp;
            const windSpeed = item.wind.speed;
            const humidity = item.main.humidity;
            const weatherDescription = item.weather[0].main; // Extract weather description from data      
        
            const weatherIconClass = weatherIcons[weatherDescription] || 'fas fa-question'; // Default icon if no match found
            console.log(`weather description:`, weatherDescription);
            const iconElement = `<i class="${weatherIconClass}"></i>`; // Create icon element

            // Generate HTML for a card representing each day's forecast
            forecastHTML += `
                <div class="card forecast-card">
                    <div class="card-body">
                        <h5 class="card-title">${formattedDate} <i class="${weatherIconClass}"></i></h5>
                        <p class="card-text">Temperature: ${temperature}°C</p>
                        <p>Wind Speed: ${windSpeed} m/s</p>
                        <p>Humidity: ${humidity}%</p>
                    </div>
                </div>
            `;

            forecastMap.set(dateKey, true); // Mark date as included in the map to prevent duplicates
        }
    });

    forecastContainer.innerHTML = forecastHTML; // Update forecast section
}


// Function to add a city to the search history
function addToSearchHistory(city) {
    // Check if the city is already in the search history
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        // Update the search history display
        updateSearchHistory();
    }
}

// Function to update the search history display
function updateSearchHistory() {
    const historyList = document.getElementById('search-history');
    // Clear the existing search history
    historyList.innerHTML = '';
    // Create list items for each city in the search history
    searchHistory.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        // Add event listener to each list item
        listItem.addEventListener('click', () => {
            getWeather(city);
        });
        historyList.appendChild(listItem);
    });
}

// Update search history when a city is searched
function getWeather(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
            addToSearchHistory(city); // Add searched city to search history
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching weather data. Please try again later.');
        });
}

// Add event listener to the search form
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city').value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Initial update of the search history
updateSearchHistory();


