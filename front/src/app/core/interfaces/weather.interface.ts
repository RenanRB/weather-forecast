export interface WeatherUnits {
  temperatureMax: string;
  temperatureMin: string;
  rainSum: string;
  windSpeed: string;
  windGusts: string;
  windDirection: string;
  uvIndex: string;
  apparentTemperatureMax: string;
  apparentTemperatureMin: string;
}

export interface WeatherData {
  time: string;
  temperatureMax: number;
  temperatureMin: number;
  sunrise: string;
  sunset: string;
  rainSum: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  uvIndex: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
}

export interface CurrentWeatherData {
  humidity: number;
  temperature: number;
  apparentTemperature: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  isDayOrNight: boolean;
  surfacePressure: number;
  weatherCode: number;
}

export interface CurrentWeatherUnits {
  humidity: string;
  temperature: string;
  apparentTemperature: string;
  windSpeed: string;
  windDirection: string;
  windGusts: string;
  isDayOrNight: string;
  surfacePressure: string;
}

export interface WeatherResponse {
  forecastUnits: WeatherUnits,
  dailyForecast: WeatherData[],
  historicalWeatherData: WeatherData[],
  currentWeatherData: CurrentWeatherData,
  currentWeatherUnits: CurrentWeatherUnits,
} 
