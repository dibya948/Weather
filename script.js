
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherInfo = document.getElementById("weather-info");

const weatherCodes = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Foggy", "🌫️"],
    48: ["Foggy", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Drizzle", "🌦️"],
    55: ["Heavy drizzle", "🌧️"],
    61: ["Light rain", "🌦️"],
    63: ["Rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    71: ["Light snow", "🌨️"],
    73: ["Snow", "❄️"],
    75: ["Heavy snow", "❄️"],
    80: ["Rain showers", "🌦️"],
    81: ["Rain showers", "🌧️"],
    82: ["Heavy rain showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Severe thunderstorm", "⛈️"]
};

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading weather...";
    weatherInfo.classList.add("hidden");

    try {
        // Find the city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another name.");
        }

        const place = geoData.results[0];
        const latitude = place.latitude;
        const longitude = place.longitude;

        // Get current weather using coordinates
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        const [description, icon] =
            weatherCodes[current.weather_code] || ["Unknown conditions", "🌡️"];

        // Display weather information
        document.getElementById("city-name").textContent =
            `${place.name}, ${place.country}`;

        document.getElementById("weather-icon").textContent =
            current.is_day ? icon : "🌙";

        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        document.getElementById("description").textContent =
            description;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        weatherInfo.classList.remove("hidden");
        message.textContent =
            `Feels like ${Math.round(current.apparent_temperature)}°C`;

    } catch (error) {
        message.textContent = error.message ||
            "Something went wrong. Please try again.";
        weatherInfo.classList.add("hidden");
    }
});
