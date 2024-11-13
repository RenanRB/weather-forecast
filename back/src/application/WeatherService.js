const Weather = require('../domain/weather/Weather');
const OpenMeteoAPI = require('../infrastructure/OpenMeteoAPI');

class WeatherService {
    static async getWeather(lat, lon) {
        const data = await OpenMeteoAPI.fetchWeatherData(lat, lon);
        return new Weather(data);
    }
}

module.exports = WeatherService;
