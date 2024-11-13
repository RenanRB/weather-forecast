const DTOInterface = require('../DTOInterface');

class Weather extends DTOInterface {
    constructor({ latitude, longitude, timezone, hourly }) {
        super();
        this.latitude = latitude;
        this.longitude = longitude;
        this.timezone = timezone;
        this.hourly = hourly ? hourly.temperature_2m.map((temp, index) => ({
            time: hourly.time[index],
            temperature: temp,
            precipitation: hourly.precipitation[index] || 0
        })) : [];
    }

    toJSON() {
        return {
            type: 'weather',
            latitude: this.latitude,
            longitude: this.longitude,
            timezone: this.timezone,
            hourly: this.hourly
        };
    }
}

module.exports = Weather;
