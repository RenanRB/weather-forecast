const axios = require('axios');

class OpenMeteoAPI {
    async fetchWeatherData(lat, lon) {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                hourly: 'temperature_2m,precipitation',
                timezone: 'auto'
            }
        });
        return response.data;
    }

    async fetchGeocodeData(location) {
        const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: {
                name: location,
                language: 'en',
                count: 10,
                format: 'json'
            }
        });
        return response.data.results;
    }
}

module.exports = OpenMeteoAPI;
