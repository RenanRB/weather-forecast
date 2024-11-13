import { Request, Response } from 'express';
import { WeatherService } from '../../application/WeatherService';
import { OpenMeteoAPI } from '../../infrastructure/OpenMeteoAPI';

export class WeatherController {
    async getWeather(req: Request, res: Response): Promise<Response> {
        const { lat, lon, source = 'open-meteo' } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        let weatherAdapter;

        if (source === 'open-meteo') {
            weatherAdapter = new OpenMeteoAPI();
        } else {
            return res.status(400).json({ error: 'No valid adapter was selected' });
        }

        const weatherService = new WeatherService(weatherAdapter);

        try {
            const latitude = parseFloat(lat as string);
            const longitude = parseFloat(lon as string);

            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
            }

            const weatherResult = await weatherService.getWeather(latitude, longitude);
            return res.json(weatherResult);
        } catch (error) {
            return res.status(500).json({ error: 'Error fetching weather forecast' });
        }
    }
}
