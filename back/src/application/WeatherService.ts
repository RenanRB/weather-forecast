import { WeatherAdapter, WeatherResult } from '../domain/WeatherAdapter';

export class WeatherService {
    constructor(private readonly weatherAdapter: WeatherAdapter) {}

    async getWeather(lat: number, lon: number): Promise<WeatherResult[]> {
        return this.weatherAdapter.fetchWeatherData(lat, lon);
    }
}
