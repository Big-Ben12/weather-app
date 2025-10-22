import './styles.css';
import { fetchWeather } from './weather.js';
import { fetchGif } from './giphy.js';

const vcApiKey = 'AQ7TT8YFZ8QCXAU5AA3Q626F2';
const giphyKey = 'gbJg7izwWiHVbI89il9Y5R7rk6ev5yiS';

let unit = 'fahrenheit';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchBtn').onclick = () => getWeather();
  document.getElementById('unitToggle').onclick = () => toggleUnit();
});

async function getWeather() {
  const location = document.getElementById('searchBox').value.trim();
  document.getElementById('errorMsg').textContent = '';
  document.getElementById('results').innerHTML = '';
  document.getElementById('gifResult').innerHTML = '';
  if (!location) {
    document.getElementById('errorMsg').textContent = 'Please enter a location.';
    return;
  }
  try {
    const weather = await fetchWeather(location, unit, vcApiKey);
    displayWeather(weather, unit);
  } catch (e) {
    document.getElementById('errorMsg').textContent = e.message;
  }
}

function toggleUnit() {
  unit = unit === 'fahrenheit' ? 'celsius' : 'fahrenheit';
  document.getElementById('unitToggle').textContent = unit === 'fahrenheit' ? 'Show °C' : 'Show °F';
  if (document.getElementById('results').innerHTML.trim()) {
    getWeather();
  }
}

function displayWeather(weather, unit) {
  const c = weather.currentConditions;
  let temp = c.temp;
  if (unit === 'celsius') {
    temp = ((temp - 32) * 5 / 9).toFixed(1);
  } else {
    temp = temp.toFixed(1);
  }
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  document.getElementById('results').innerHTML = `
    <h3>${weather.resolvedAddress}</h3>
    <div class="weather-condition">${c.conditions}</div>
    <div class="weather-temp">${temp} ${unitSymbol}</div>
    <div class="weather-details">
      Humidity: ${c.humidity}%<br>
      Wind: ${c.windspeed} mph
    </div>
    <div class="updated-time">Updated: ${c.datetime}</div>
  `;

  updateBackground(c.conditions);
}

function preloadGif(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function updateBackground(condition) {
  condition = condition ? condition.toLowerCase() : '';
  let color, gifQuery;
  if (condition.includes('rain')) {
    color = '#8ecae6'; gifQuery = 'rain';
  } else if (condition.includes('cloud')) {
    color = '#c0c0c0'; gifQuery = 'cloudy';
  } else if (condition.includes('clear')) {
    color = '#ffe066'; gifQuery = 'sunny';
  } else if (condition.includes('snow')) {
    color = '#f1f9ff'; gifQuery = 'snow';
  } else { color = '#fafafa'; gifQuery = 'weather'; }
  document.body.style.backgroundColor = color;
  fetchGif(gifQuery, giphyKey)
    .then(imgUrl => {
      if (!imgUrl) {
        document.getElementById('gifResult').innerHTML = '';
        return;
      }
      // Preload the GIF first
      preloadGif(imgUrl)
        .then(img => {
          const container = document.getElementById('gifResult');
          container.innerHTML = ''; // clear any old content
          container.appendChild(img);
          img.alt = `${gifQuery} weather gif`;
          img.className = 'weather-gif'; // for styling
          // Optionally add fade-in effect here
          img.style.opacity = 0;
          img.style.transition = 'opacity 0.5s ease-in-out';
          requestAnimationFrame(() => {
            img.style.opacity = 1;
          });
        })
        .catch(() => {
          document.getElementById('gifResult').innerHTML = '';
        });
    })
    .catch(() => {
      document.getElementById('gifResult').innerHTML = '';
    });
}
