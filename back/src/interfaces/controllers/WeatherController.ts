import { Request, Response } from 'express';
import { WeatherService } from '../../application/WeatherService';
import { OpenMeteoAPI } from '../../infrastructure/OpenMeteoAPI';

export class WeatherController {

    async getWeather(req: Request, res: Response): Promise<Response> {
        const { lat, lon, timezone, source = 'open-meteo' } = req.query;

        const coordinatesResult = this.validateInformation(lat, lon, timezone);
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
                coordinatesResult.longitude!,
                coordinatesResult.timezone
            );
            return res.json(weatherResult);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching weather forecast' });
        }
    }
    private validateInformation(lat: any, lon: any, timezone: any) {
        if (!lat || !lon) {
            return { error: 'Latitude and longitude are required' };
        }

        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lon as string);

        if (isNaN(latitude) || isNaN(longitude)) {
            return { error: 'Latitude and longitude must be valid numbers' };
        }

        if (!timezone) {
            return { error: 'Timezone is required' };
        }

        return { latitude, longitude, timezone };
    }

    private getWeatherAdapter(source: any): OpenMeteoAPI | null {
        if (source === 'open-meteo') {
            return new OpenMeteoAPI();
        }
        return null;
    }
}
