export interface WeatherResult {
    forecastUnits: WeatherUnits,
    dailyForecast: WeatherData[],
    historicalWeatherData: WeatherData[],
    currentWeatherData: CurrentWeatherData,
    currentWeatherUnits: CurrentWeatherUnits,
}

export interface WeatherData {
    time: string,
    weatherCode: number,
    temperatureMax: number,
    temperatureMin: number,
    sunrise: string,
    sunset: string,
    rainSum: number,
    windSpeed: number,
    windGusts: number,
    windDirection: number,
    uvIndex: number,
    apparentTemperatureMax: number,
    apparentTemperatureMin: number,
}

export interface WeatherUnits {
    temperatureMax: string,
    temperatureMin: string,
    rainSum: string,
    windSpeed: string,
    windGusts: string,
    windDirection: string,
    uvIndex: string,
    apparentTemperatureMax: string,
    apparentTemperatureMin: string,
}

export interface CurrentWeatherData {
    humidity: number,
    temperature: number,
    apparentTemperature: number,
    windSpeed: number,
    windDirection: number,
    windGusts: number,
    isDayOrNight: boolean,
    surfacePressure: number,
    weatherCode: number,
}

export interface CurrentWeatherUnits {
    humidity: string,
    temperature: string,
    apparentTemperature: string,
    windSpeed: string,
    windDirection: string,
    windGusts: string,
    isDayOrNight: string,
    surfacePressure: string,
}

export interface WeatherAdapter {
    fetchWeatherData(lat: number, lon: number, timezone: string): Promise<WeatherResult>;
}