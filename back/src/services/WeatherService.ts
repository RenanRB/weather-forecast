import { WeatherAdapter, WeatherResult } from '../interfaces/WeatherAdapter';

export class WeatherService {
    constructor(private readonly weatherAdapter: WeatherAdapter) {}

    async getWeather(lat: number, lon: number, timezone: string): Promise<WeatherResult> {
        this.validateCoordinates(lat, lon);

        try {
            const result = await this.weatherAdapter.fetchWeatherData(lat, lon, timezone);
            
            if (!result || result.dailyForecast?.length === 0) {
                throw new Error('No weather data available');
            }

            return result;
        } catch (error) {
            throw error instanceof Error ? error : new Error('Failed to fetch weather data');
        }
    }

    private validateCoordinates(lat: number, lon: number): void {
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            throw new Error('Invalid coordinates');
        }
    }
}
