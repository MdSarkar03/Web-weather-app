document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const countryNameDisplay = document.getElementById("country-name");
  const temperatureDisplay = document.getElementById("temperature");
  const feelsLikeDisplay = document.getElementById("feels-like");
  const descriptionDisplay = document.getElementById("description");
  const windSpeedDisplay = document.getElementById("wind-speed");
  const humidityDisplay = document.getElementById("humidity");
  const sunriseDisplay = document.getElementById("sunrise");
  const sunsetDisplay = document.getElementById("sunset");
  const errorMessage = document.getElementById("error-message");

  const API_KEY = "c4721cbb4beaa5d1bcbd7854185eccef"; //my

  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    //it may throw error
    //server/database is always in another continent

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    //gets the data
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    console.log(typeof response);
    console.log("RESPONSE", response);

    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data;
  }

  //loader
  function showLoader() {
    document.querySelector(".fullscreen-loader").classList.remove("hidden");
  }
  function hideLoader() {
    document.querySelector(".fullscreen-loader").classList.add("hidden");
  }

  //latitude & longitude
  async function getWeatherByCoords(lat, lon) {
    showLoader();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }
      const data = await response.json();
      displayWeatherData(data);
    } catch (error) {
      showError();
    } finally {
      hideLoader();
    }
  }

  cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      getWeatherBtn.click();
    }
  });

  function displayWeatherData(data) {
    //display
    console.log(data);
    cityInput.value = data.name;
    const { name, main, weather, wind, sys, dt } = data;
    cityNameDisplay.textContent = name;
    countryNameDisplay.textContent = `, ${sys.country}`;

    let rise = new Date(sys.sunrise * 1000);
    let set = new Date(sys.sunset * 1000);
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById("weather-icon").src = iconUrl;

    const date = new Date(dt * 1000);
    const datePart = date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    document.getElementById(
      "observed-at"
    ).textContent = `\u24D8 Last updated: ${datePart} at ${timePart}`;

    temperatureDisplay.textContent = `${main.temp}\u00B0C`;
    descriptionDisplay.textContent = `, ${weather[0].description}`;

    feelsLikeDisplay.querySelector(
      ".value"
    ).textContent = ` ${main.feels_like}\u00b0C`;
    humidityDisplay.querySelector(".value").textContent = ` ${main.humidity}%`;
    windSpeedDisplay.querySelector(".value").textContent = ` ${wind.speed} m/s`;

    sunriseDisplay.querySelector(
      ".value"
    ).textContent = ` ${rise.toLocaleTimeString()}`;
    sunsetDisplay.querySelector(
      ".value"
    ).textContent = ` ${set.toLocaleTimeString()}`;

    //unlock the display
    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }

  function showError() {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");
  }

  //triggering geolocation
  if ("geolocation" in navigator) {
    showLoader();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        hideLoader();
        console.error("Geolocation error", error.message);
      }
    );
  } else {
    console.error("Geolocation not supported!");
    hideLoader();
  }

  // theme toggle
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      themeToggle.textContent = "🌞";
    } else {
      document.body.classList.remove("light-theme");
      themeToggle.textContent = "🌙";
    }
    localStorage.setItem("theme", theme);
  }

  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("light-theme")
      ? "dark"
      : "light";
    applyTheme(newTheme);
  });
});
