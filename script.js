document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const city = document.getElementById('cityName').value;
    
    // Aggiungi le coordinate delle città
    const cityCoordinates = {
      "Torino": { lat: 45.0703, lon: 7.6869 },
      "Milano": { lat: 45.4642, lon: 9.1900 },
      "Roma": { lat: 41.9028, lon: 12.4964 },
      "Napoli": { lat: 40.8522, lon: 14.2681 },
      "Madrid": { lat: 40.4168, lon: -3.7038 },
      "Lisboa": { lat: 38.7169, lon: -9.1395 },
      "Parigi": { lat: 48.8566, lon: 2.3522 },
      "Berlino": { lat: 52.5200, lon: 13.4050 },
      "Londra": { lat: 51.5074, lon: -0.1278 },
      "Washington": { lat: 38.9072, lon: -77.0369 },
      "Tokyo": { lat: 35.6762, lon: 139.6503 },
      "New York": { lat: 40.7128, lon: -74.0060 },
      "Los Angeles": { lat: 34.0522, lon: -118.2437 },
      "Shanghai": { lat: 31.2304, lon: 121.4737 },
      "Mumbai": { lat: 19.0760, lon: 72.8777 },
      "Pechino": { lat: 39.9042, lon: 116.4074 },
      "Città del Messico": { lat: 19.4326, lon: -99.1332 },
      "São Paulo": { lat: -23.5505, lon: -46.6333 },
      "Dakka": { lat: 23.8103, lon: 90.4125 },
      "Karachi": { lat: 24.8607, lon: 67.0011 },
      "Buenos Aires": { lat: -34.6037, lon: -58.3816 }
    };
    
    const cityData = cityCoordinates[city];
  
    if (!cityData) {
      alert('Città non trovata. Prova con una delle città predefinite.');
      return;
    }
  
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FRome`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Gestire i dati meteo qui
        document.getElementById('cityNameDisplayResults').textContent = city;
  
        // Mostra la temperatura attuale e le condizioni
        const currentWeather = data.current_weather;
        const temperature = currentWeather.temperature;
        const weatherCode = currentWeather.weathercode;
        let weatherDescription = '';
        let emoji = '';
        let backgroundColor = '';
  
        // Determina l'emoji, la descrizione meteo e il colore di sfondo
        switch (weatherCode) {
          case 0:
            weatherDescription = 'Soleggiato';
            emoji = '☀️';
            backgroundColor = '#87CEEB'; // Azzurro per il sole
            break;
          case 1:
          case 2:
          case 3:
            weatherDescription = 'Nuvoloso';
            emoji = '☁️';
            backgroundColor = '#B0B0B0'; // Grigio per nuvoloso
            break;
          case 51:
          case 53:
          case 55:
            weatherDescription = 'Pioggia leggera';
            emoji = '🌧️';
            backgroundColor = '#ADD8E6'; // Blu chiaro per pioggia leggera
            break;
          case 61:
          case 63:
          case 65:
            weatherDescription = 'Pioggia forte';
            emoji = '🌧️';
            backgroundColor = '#6495ED'; // Blu per pioggia forte
            break;
          case 80:
          case 81:
          case 82:
            weatherDescription = 'Temporale';
            emoji = '⛈️';
            backgroundColor = '#4682B4'; // Blu scuro per temporale
            break;
          default:
            weatherDescription = 'Condizione sconosciuta';
            emoji = '❓';
            backgroundColor = '#f0f8ff'; // Colore di default
        }
  
        // Cambia il colore di sfondo in base alle condizioni meteo
        document.body.style.backgroundColor = backgroundColor;
  
        // Mostra il meteo attuale
        document.getElementById('currentWeather').textContent = `${emoji} ${weatherDescription} - ${temperature}°C`;
  
        // Funzione per ottenere il nome del giorno della settimana
        function getDayName(index) {
          const daysOfWeek = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
          return daysOfWeek[index];
        }
  
        // Mostra la previsione per i prossimi giorni
        const forecastList = document.getElementById('forecast');
        forecastList.innerHTML = ''; // Resetta i risultati precedenti
  
        data.daily.temperature_2m_max.forEach((temp, index) => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          
          // Determina le condizioni meteo per il giorno
          const dailyWeatherCode = data.daily.weathercode[index];
          let dailyDescription = '';
          let dailyEmoji = '';
  
          switch (dailyWeatherCode) {
            case 0:
              dailyDescription = 'Soleggiato';
              dailyEmoji = '☀️';
              break;
            case 1:
            case 2:
            case 3:
              dailyDescription = 'Nuvoloso';
              dailyEmoji = '☁️';
              break;
            case 51:
            case 53:
            case 55:
              dailyDescription = 'Pioggia leggera';
              dailyEmoji = '🌧️';
              break;
            case 61:
            case 63:
            case 65:
              dailyDescription = 'Pioggia forte';
              dailyEmoji = '🌧️';
              break;
            case 80:
            case 81:
            case 82:
              dailyDescription = 'Temporale';
              dailyEmoji = '⛈️';
              break;
            default:
              dailyDescription = 'Condizione sconosciuta';
              dailyEmoji = '❓';
          }
  
          listItem.textContent = `${getDayName(index)}: Max ${temp}°C - Min ${data.daily.temperature_2m_min[index]}°C - ${dailyEmoji} ${dailyDescription}`;
          forecastList.appendChild(listItem);
        });
        
        document.getElementById('weatherResults').classList.remove('d-none');
      })
      .catch(error => {
        alert('Errore nel recupero delle previsioni meteo');
      });
  });
  
