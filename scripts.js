function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
            
            showMap(lat, lon);

            getWeatherData(lat, lon);

            getCityInfo(lat, lon);
            
            document.getElementById('location').innerText = `Sua Localização: Latitude: ${lat}, Longitude: ${lon}`;
        }, (error) => {
            document.getElementById('weather').innerHTML = '<span class="error">Erro ao obter sua localização.</span>';
            console.error('Erro ao obter localização:', error);
        });
    } else {
        document.getElementById('weather').innerHTML = '<span class="error">Geolocalização não é suportada neste navegador.</span>';
    }
}

function getWeatherData(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&precipitation=true&windspeed_unit=kmh&humidity=true&temperature_unit=celsius&language=pt`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;
            const temperature = weather.temperature;
            const weatherDescription = weather.weathercode;
            const humidity = weather.humidity !== undefined ? weather.humidity : 'Não disponível';  // Valor padrão para umidade
            const windSpeed = weather.windspeed;
            const precipitation = weather.precipitation !== undefined ? weather.precipitation : 0;  // Valor padrão para precipitação
            const timestamp = new Date(weather.time * 1000);  // Converte para milissegundos
            const formattedTime = timestamp.toLocaleString('pt-BR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric'
            });

            const weatherConditions = {
                0: "Céu limpo",
                1: "Poucas nuvens",
                2: "Nuvens dispersas",
                3: "Nuvens",
                45: "Nevoeiro",
                48: "Nevoeiro gelado",
                51: "Chuvas leves",
                53: "Chuvas moderadas",
                55: "Chuvas fortes",
                56: "Neve leve",
                57: "Neve forte",
                61: "Chuva leve",
                63: "Chuva moderada",
                65: "Chuva forte",
                66: "Neve leve",
                67: "Neve forte",
                71: "Chuvas de granizo leves",
                73: "Chuvas de granizo moderadas",
                75: "Chuvas de granizo fortes",
                77: "Granizo leve",
                79: "Granizo forte",
                80: "Trovoadas",
                81: "Trovoadas intensas",
                82: "Trovoadas muito intensas"
            };

            document.getElementById('weather').innerHTML = `
                <div class="temp">${temperature}°C</div>
                <div class="details">Clima: ${weatherConditions[weatherDescription]}<br>
                Vento: ${windSpeed} km/h<br>
                Precipitação: ${precipitation} mm</div>
            `;
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = '<span class="error">Erro ao obter a previsão do tempo.</span>';
            console.error('Erro ao obter clima:', error);
        });
}

function showMap(lat, lon) {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}&hl=pt-br&z=14&output=embed`;
    const iframe = document.createElement('iframe');
    iframe.src = mapUrl;
    iframe.width = '100%';
    iframe.height = '400';
    iframe.style.border = '0';
    iframe.allowfullscreen = true;
    iframe.loading = 'lazy';
    document.getElementById('map').appendChild(iframe);
}

function getCityInfo(lat, lon) {
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&language=pt`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state;
            const country = data.address.country;

            document.getElementById('location').innerText = `Localização: ${city}, ${state}, ${country} | Latitude: ${lat}, Longitude: ${lon}`;
        })
        .catch(error => {
            document.getElementById('location').innerText = `Não foi possível determinar a cidade, estado e país. Latitude: ${lat}, Longitude: ${lon}`;
            console.error('Erro ao obter informações geográficas:', error);
        });
}

getUserLocation();