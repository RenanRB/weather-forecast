const express = require('express');
const WeatherController = require('./controllers/WeatherController');
const GeocodeController = require('./controllers/GeocodeController');

const app = express();
const PORT = 3000;

app.get('/weather', WeatherController.getWeather);
app.get('/cities', GeocodeController.getGeocode);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
