import { Request, Response } from 'express';
import { GeocodeService } from '../../application/GeocodeService';
import { OpenMeteoAPI } from '../../infrastructure/OpenMeteoAPI';

export class GeocodeController {
    async getGeocode(req: Request, res: Response): Promise<Response> {
        const { location, source = 'open-meteo' } = req.query;

        const locationResult = this.validateLocation(location);
        if (locationResult.error) {
            return res.status(400).json({ error: locationResult.error });
        }

        const geocodeAdapter = this.getGeocodeAdapter(source);
        if (!geocodeAdapter) {
            return res.status(400).json({ error: 'No valid adapter was selected' });
        }

        try {
            const geocodeService = new GeocodeService(geocodeAdapter);
            const geocodeResults = await geocodeService.getGeocode(locationResult.validLocation!);
            return res.json(geocodeResults);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching address' });
        }
    }

    private validateLocation(location: any): { error?: string; validLocation?: string } {
        if (!location || typeof location !== 'string') {
            return { error: 'Location parameter is required' };
        }
        return { validLocation: location };
    }

    private getGeocodeAdapter(source: any): OpenMeteoAPI | null {
        if (source === 'open-meteo') {
            return new OpenMeteoAPI();
        }
        return null;
    }
}
