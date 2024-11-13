import { WeatherAdapterInterface, WeatherResult } from '../domain/weather/WeatherAdapterInterface';

export class WeatherService {
    constructor(private readonly weatherAdapter: WeatherAdapterInterface) {}

    async getWeather(lat: number, lon: number): Promise<WeatherResult[]> {
        return this.weatherAdapter.fetchWeatherData(lat, lon);
    }
}
