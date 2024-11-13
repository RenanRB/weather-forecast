const WeatherService = require('../../application/WeatherService');

class WeatherController {
    static async getWeather(req, res) {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        try {
            const weather = await WeatherService.getWeather(lat, lon);
            res.json(weather.toJSON());
        } catch (error) {
            res.status(500).json({ error: 'Error fetching weather forecast' });
        }
    }
}

module.exports = WeatherController;
