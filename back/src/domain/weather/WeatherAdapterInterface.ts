export interface WeatherResult {
    formatted: string;
    latitude: number;
    longitude: number;
}

export interface WeatherAdapterInterface {
    fetchWeatherData(lat: number, lon: number): Promise<WeatherResult[]>;
}