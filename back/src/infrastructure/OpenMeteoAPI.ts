import axios from 'axios';
import { GeocodeAdapterInterface, GeocodeResult } from '../domain/geocode/GeocodeAdapterInterface';
import { WeatherAdapterInterface } from '../domain/weather/WeatherAdapterInterface';

export class OpenMeteoAPI implements GeocodeAdapterInterface, WeatherAdapterInterface {
    async fetchWeatherData(lat: number, lon: number) {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                hourly: 'temperature_2m,precipitation',
                timezone: 'auto'
            }
        });
        return response.data;
    }

    async fetchGeocodeData(location: string): Promise<GeocodeResult[]> {
        const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: {
                name: location,
                count: 5
            }
        });

        return response.data.results.map((result: any) => ({
            formatted: result.name,
            latitude: result.latitude,
            longitude: result.longitude
        }));
    }
}
