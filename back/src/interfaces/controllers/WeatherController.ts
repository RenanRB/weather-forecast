import { Request, Response } from 'express';
import { WeatherService } from '../../application/WeatherService';
import { OpenMeteoAPI } from '../../infrastructure/OpenMeteoAPI';

export class WeatherController {

    async getWeather(req: Request, res: Response): Promise<Response> {
        const { lat, lon, source = 'open-meteo' } = req.query;

        const coordinatesResult = this.validateCoordinates(lat, lon);
        if (coordinatesResult.error) {
            return res.status(400).json({ error: coordinatesResult.error });
        }

        const weatherAdapter = this.getWeatherAdapter(source);
        if (!weatherAdapter) {
            return res.status(400).json({ error: 'No valid adapter was selected' });
        }

        try {
            const weatherService = new WeatherService(weatherAdapter);
            const weatherResult = await weatherService.getWeather(
                coordinatesResult.latitude!,
                coordinatesResult.longitude!
            );
            return res.json(weatherResult);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching weather forecast' });
        }
    }
    private validateCoordinates(lat: any, lon: any): { error?: string; latitude?: number; longitude?: number } {
        if (!lat || !lon) {
            return { error: 'Latitude and longitude are required' };
        }

        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lon as string);

        if (isNaN(latitude) || isNaN(longitude)) {
            return { error: 'Latitude and longitude must be valid numbers' };
        }

        return { latitude, longitude };
    }

    private getWeatherAdapter(source: any): OpenMeteoAPI | null {
        if (source === 'open-meteo') {
            return new OpenMeteoAPI();
        }
        return null;
    }
}
