export interface WeatherResult {
    time: string,
    weatherCode: number,
    temperatureMax: number,
    temperatureMin: number,
    sunrise: string,
    sunset: string,
    rainSum: number,
    windSpeed: number,
    windGusts: number,
    windDirection: number
}

export interface WeatherAdapter {
    fetchWeatherData(lat: number, lon: number): Promise<WeatherResult[]>;
}