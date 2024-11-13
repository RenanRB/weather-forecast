const GeocodeService = require('../../application/GeocodeService');
const OpenMeteoAPI = require('../../infrastructure/OpenMeteoAPI');

class GeocodeController {
    static async getGeocode(req, res) {
        const { location, source = 'open-meteo' } = req.query;
        if (!location) {
            return res.status(400).json({ error: 'Location parameter is required' });
        }

        let geocodeAdapter;

        if (source === 'open-meteo') {
            geocodeAdapter = new OpenMeteoAPI();
        } else {
            return res.status(400).json({ error: 'No valid adapter was selected' });
        }

        const geocodeService = new GeocodeService(geocodeAdapter);

        try {
            const geocode = await geocodeService.getGeocode(location);
            res.json(geocode.toJSON());
        } catch (error) {
            res.status(500).json({ error });
            // res.status(500).json({ error: 'Error fetching address' });
        }
    }
}

module.exports = GeocodeController;