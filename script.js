function getWeather() {
    const apiKey = 'c4721cbb4beaa5d1bcbd7854185eccef'; 

    const city = document.getElementById('city').value;
    const unit = document.getElementById('unit').value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const result = document.getElementById('result');
            result.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>${Math.round(data.main.temp)}°${unit === 'metric' ? 'C' : 'F'}</p>
                <p>${data.weather[0].description}</p>
            `;
        })
        .catch(error => console.error('Error:', error));
}

function toggleDarkMode() {
    const darkMode = document.getElementById('darkMode').checked;

    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

document.getElementById('darkMode').addEventListener('change', toggleDarkMode);

document.getElementById('darkMode').checked = false;
toggleDarkMode();
