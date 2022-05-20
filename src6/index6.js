function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#mainTemperature");
  temperatureElement.innerHTML = `${Math.round(response.data.main.temp)}°C`;
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
}

let apiKey = "df06795b838448a58ab71c48a5044292";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Istanbul&units=metric&appid=${apiKey}`;

console.log(apiUrl);
axios.get(apiUrl).then(displayTemperature);
