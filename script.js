// script.js
const apiKey = '16a3756928586ee8f5a73b26dd209ad3'; // Replace with your actual OpenWeatherMap API key
const cityInput = document.getElementById('city-input');
const suggestionsContainer = document.getElementById('suggestions');
const locationElement = document.getElementById('location');
const tempElement = document.getElementById('temp');
const weatherElement = document.getElementById('weather');
const searchButton = document.getElementById('search-btn');

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const { name } = data;
            const { description } = data.weather[0];
            const { temp } = data.main;

            locationElement.textContent = `Location: ${name}`;
            tempElement.textContent = `Temperature: ${Math.round(temp)}°C`;
            weatherElement.textContent = `Condition: ${description}`;
            suggestionsContainer.innerHTML = '';

            // Change background color based on temperature
            updateBackgroundColor(temp);
        })
        .catch(error => {
            locationElement.textContent = 'City not found. Please try again.';
            tempElement.textContent = 'Temperature: --°C';
            weatherElement.textContent = 'Condition: --';
            console.error(error);
        });
}

// Update the whole background color based on temperature
function updateBackgroundColor(temp) {
    // Reset classes
    document.body.classList.remove('cold', 'cool', 'warm', 'hot');

    if (temp <= 0) {
        document.body.classList.add('cold');
    } else if (temp > 0 && temp <= 15) {
        document.body.classList.add('cool');
    } else if (temp > 15 && temp <= 30) {
        document.body.classList.add('warm');
    } else {
        document.body.classList.add('hot');
    }
}

// Fetch city suggestions from OpenWeatherMap API
function fetchCitySuggestions(query) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            suggestionsContainer.innerHTML = '';
            if (data.length > 0) {
                suggestionsContainer.style.display = 'block';
                data.forEach(city => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = `${city.name}, ${city.country}`;
                    suggestion.addEventListener('click', () => {
                        cityInput.value = `${city.name}, ${city.country}`;
                        fetchWeatherData(city.name);
                        suggestionsContainer.style.display = 'none';
                    });
                    suggestionsContainer.appendChild(suggestion);
                });
            } else {
                suggestionsContainer.style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching city suggestions:', error));
}

// Event listener for input suggestions
cityInput.addEventListener('input', () => {
    const query = cityInput.value.trim();
    if (query.length > 2) {
        fetchCitySuggestions(query);
    } else {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
    }
});

// Event listener for search button
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

// Event listener for Enter key to submit search
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    }
});
