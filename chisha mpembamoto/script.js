document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
            getForecast(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    document.getElementById('searchButton').addEventListener('click', () => {
        const location = document.getElementById('searchInput').value;
        getWeatherByLocation(location);
        getForecastByLocation(location);
    });
});

function getWeather(lat, lon) {
    const apiKey = '5d67ecca30bfa52b4c8fd153e8c94584'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function getWeatherByLocation(location) {
    const apiKey = '5d67ecca30bfa52b4c8fd153e8c94584'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function getForecast(lat, lon) {
    const apiKey = '5d67ecca30bfa52b4c8fd153e8c94584'; 
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

function getForecastByLocation(location) {
    const apiKey = '5d67ecca30bfa52b4c8fd153e8c94584'; 
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

function updateUI(data) {
    const location = `${data.name}, ${data.sys.country}`;
    const temperature = `${Math.round(data.main.temp)}°C`;
    const description = data.weather[0].description;
    const humidity = `Humidity: ${data.main.humidity}%`;
    const wind = `Wind: ${data.wind.speed} m/s`;
    const datetime = new Date().toLocaleString();
    const iconCode = data.weather[0].icon;

    document.querySelector('.location').textContent = location;
    document.querySelector('.temperature').textContent = temperature;
    document.querySelector('.description').textContent = description;
    document.querySelector('.humidity').textContent = humidity;
    document.querySelector('.wind').textContent = wind;
    document.querySelector('.datetime').textContent = datetime;
    document.querySelector('.icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">`;

    updateBackgroundVideo(data.weather[0].main);
}

function updateForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
        const temp = `${Math.round(data.list[i].main.temp)}°C`;
        const desc = data.list[i].weather[0].description;
        const iconCode = data.list[i].weather[0].icon;

        forecastItem.innerHTML = `
            <div>${date}</div>
            <div><img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="${desc}"></div>
            <div>${temp}</div>
            <div>${desc}</div>
        `;

        forecastContainer.appendChild(forecastItem);
    }
}

function updateBackgroundVideo(weather) {
    let videoSource;
    switch (weather) {
        case 'Clear':
            videoSource = 'videos/clear_sky.mp4';
            break;
        case 'broken clouds':
            videoSource = 'videos/broken clouds.mp4';
            break;
        case 'overcast clouds.mp4':
            videoSource = 'videos/overcast clouds.mp4';
            break;
        case 'Clouds':
            videoSource = 'videos/clouds.mp4';
            break;
        case 'Rain':
            videoSource = 'videos/Rain.mp4';
            break;
        case 'Snow':
            videoSource = 'videos/Snow.mp4';
            break;
        case 'thunderstorm':
            videoSource = 'videos/thundersome.mp4';
            break;
        case 'light rain':
            videoSource = 'videos/light rain.mp4';
            break;
        default:
            videoSource = 'videos/thunderstorm.mp4';
            break;
    }

    const videoElement = document.getElementById('background-video');
    videoElement.src = videoSource;
    videoElement.load();
    videoElement.play();
}
