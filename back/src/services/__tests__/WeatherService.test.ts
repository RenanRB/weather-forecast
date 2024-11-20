import { describe, jest, expect, beforeEach, it } from '@jest/globals';
import { WeatherService } from '../WeatherService';
import { WeatherAdapter, WeatherResult } from '../../domain/WeatherAdapter';

describe('WeatherService', () => {
    let weatherService: WeatherService;
    let mockWeatherAdapter: jest.Mocked<WeatherAdapter>;

    beforeEach(() => {
        mockWeatherAdapter = {
            fetchWeatherData: jest.fn()
        } as jest.Mocked<WeatherAdapter>;
        
        weatherService = new WeatherService(mockWeatherAdapter);
    });

    describe('getWeather', () => {
        it('should return weather data for given coordinates', async () => {
            const lat = 51.5074;
            const lon = -0.1278;
            const timezone = "Europe/London";
            
            const mockWeatherResult: WeatherResult = {
                forecastUnits: {
                    temperatureMax: "°C",
                    temperatureMin: "°C",
                    windSpeed: "km/h",
                    rainSum: "mm",
                    windGusts: "km/h",
                    windDirection: "°",
                    uvIndex: "",
                    apparentTemperatureMax: "°C",
                    apparentTemperatureMin: "°C"
                },
                dailyForecast: [{
                    time: "2024-03-20",
                    weatherCode: 2,
                    temperatureMax: 20,
                    temperatureMin: 15,
                    sunrise: "06:00",
                    sunset: "18:00",
                    rainSum: 0,
                    windSpeed: 10,
                    windGusts: 15,
                    windDirection: 180,
                    uvIndex: 5,
                    apparentTemperatureMax: 22,
                    apparentTemperatureMin: 13
                }],
                historicalWeatherData: [],
                currentWeatherData: {
                    humidity: 70,
                    temperature: 18,
                    apparentTemperature: 17,
                    windSpeed: 12,
                    windDirection: 180,
                    weatherCode: 2,
                    windGusts: 15,
                    isDayOrNight: true,
                    surfacePressure: 1013
                },
                currentWeatherUnits: {
                    humidity: "%",
                    temperature: "°C",
                    apparentTemperature: "°C",
                    windSpeed: "km/h",
                    windDirection: "°",
                    windGusts: "km/h",
                    isDayOrNight: "",
                    surfacePressure: "hPa"
                }
            };

            mockWeatherAdapter.fetchWeatherData.mockResolvedValue(mockWeatherResult);

            const result = await weatherService.getWeather(lat, lon, timezone);

            expect(result).toEqual(mockWeatherResult);
            expect(mockWeatherAdapter.fetchWeatherData).toHaveBeenCalledWith(lat, lon, timezone);
            expect(mockWeatherAdapter.fetchWeatherData).toHaveBeenCalledTimes(1);
        });

        it('should throw error when coordinates are invalid', async () => {
            const lat = 91;
            const lon = -0.1278;
            const timezone = "Europe/London";

            await expect(weatherService.getWeather(lat, lon, timezone))
                .rejects
                .toThrow('Invalid coordinates');
        });

        it('should throw error when adapter fails', async () => {
            const lat = 51.5074;
            const lon = -0.1278;
            const timezone = "Europe/London";
            const errorMessage = 'Failed to fetch weather data';
            
            mockWeatherAdapter.fetchWeatherData.mockRejectedValue(new Error(errorMessage));

            await expect(weatherService.getWeather(lat, lon, timezone))
                .rejects
                .toThrow(errorMessage);
        });

        it('should throw error when API returns empty data', async () => {
            const lat = 51.5074;
            const lon = -0.1278;
            const timezone = "Europe/London";
            
            mockWeatherAdapter.fetchWeatherData.mockResolvedValue(null as unknown as WeatherResult);

            await expect(weatherService.getWeather(lat, lon, timezone))
                .rejects
                .toThrow('No weather data available');
        });
    });
}); 