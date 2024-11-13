const Geocode = require('../domain/geocode/Geocode');

class GeocodeService {
    constructor(geocodeAdapter) {
        this.geocodeAdapter = geocodeAdapter;
    }

    async getGeocode(location) {
        const results = await this.geocodeAdapter.fetchGeocodeData(location);
        return new Geocode(results);
    }
}

module.exports = GeocodeService;