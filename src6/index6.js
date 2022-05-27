function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  let day = days[date.getDay()];

  return `<strong>${day}</strong>; as of ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[day];
}

function displayArchive(response) {
  let archive = response.data;
  console.log(response.data);
  let yesterdaysHigh = Math.round(response.data.hourly[14].temp);
  let whichDay = formatDay(response.data.current.dt);
  let archiveElement = document.querySelector("#archive");

  archiveHTML =
    `<div class="col-2">
          <div class="card">
            <div class="card-body">
               <img src="https://openweathermap.org/img/wn/${archive.current.weather[0].icon}@2x.png" alt="${archive.current.weather[0].description}" class="icon" />
              <p class="last-week">last ${whichDay}</p>
              <h3>${yesterdaysHigh}°F</h3>
            </div>
          </div>
        </div>
        ` + archiveHTML;

  archiveElement.innerHTML = archiveHTML;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
          <div class="card">
            <div class="card-body">
              <img src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="${
          forecastDay.weather[0].description
        }" class="icon" />
              <p>${formatDay(forecastDay.dt)}</p>
              <h3>${Math.round(forecastDay.temp.day)}°F</h3>
            </div>
          </div>
        </div>
`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "df06795b838448a58ab71c48a5044292";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${apiKey}`;

  axios.get(apiUrl).then(displayForecast);
}

function getArchives(coordinates, timestamp) {
  let apiKey = "df06795b838448a58ab71c48a5044292";
  let daysBefore = [1, 2, 3, 4, 5];

  daysBefore.forEach(function (daysBefore) {
    let eachDayStamp = timestamp - 86400 * daysBefore;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&dt=${eachDayStamp}&appid=${apiKey}`;
    archiveHTML = "";
    console.log(apiUrl);
    axios.get(apiUrl).then(displayArchive);
  });
}

function displayTemperature(response) {
  fahrenheitTemperature = response.data.main.temp;

  let temperatureElement = document.querySelector("#mainTemperature");
  temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°F`;
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon-main");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
  getArchives(response.data.coord, response.data.dt);
}

function search(city) {
  let apiKey = "df06795b838448a58ab71c48a5044292";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let fahrenheitTemperature = null;
let archiveHTML = "";

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("Istanbul");
