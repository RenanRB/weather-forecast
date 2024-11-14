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
            const mockWeatherResult: WeatherResult[] = [
                {
                    time: "2024-03-20",
                    weatherCode: 2,
                    temperatureMax: 20,
                    temperatureMin: 15,
                    sunrise: "06:00",
                    sunset: "18:00",
                    rainSum: 0,
                    windSpeed: 10,
                    windGusts: 15,
                    windDirection: 180
                }
            ];

            mockWeatherAdapter.fetchWeatherData.mockResolvedValue(mockWeatherResult);

            const result = await weatherService.getWeather(lat, lon);

            expect(result).toEqual(mockWeatherResult);
            expect(mockWeatherAdapter.fetchWeatherData).toHaveBeenCalledWith(lat, lon);
            expect(mockWeatherAdapter.fetchWeatherData).toHaveBeenCalledTimes(1);
        });

        it('should throw error when coordinates are invalid', async () => {
            const lat = 91;
            const lon = -0.1278;

            await expect(weatherService.getWeather(lat, lon))
                .rejects
                .toThrow('Invalid coordinates');
        });

        it('should throw error when adapter fails', async () => {
            const lat = 51.5074;
            const lon = -0.1278;
            const errorMessage = 'Failed to fetch weather data';
            
            mockWeatherAdapter.fetchWeatherData.mockRejectedValue(new Error(errorMessage));

            await expect(weatherService.getWeather(lat, lon))
                .rejects
                .toThrow(errorMessage);
        });

        it('should throw error when API returns empty data', async () => {
            const lat = 51.5074;
            const lon = -0.1278;
            
            mockWeatherAdapter.fetchWeatherData.mockResolvedValue([]);

            await expect(weatherService.getWeather(lat, lon))
                .rejects
                .toThrow('No weather data available');
        });
    });
}); 