import { Request, Response } from 'express';
import { GeocodeService } from '../../application/GeocodeService';
import { OpenMeteoAPI } from '../../infrastructure/OpenMeteoAPI';

export class GeocodeController {
    async getGeocode(req: Request, res: Response) {
        const { location, source = 'open-meteo' } = req.query;
        if (!location || typeof location !== 'string') {
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
            const geocodeResults = await geocodeService.getGeocode(location);
            res.json(geocodeResults);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching address' });
        }
    }
}
