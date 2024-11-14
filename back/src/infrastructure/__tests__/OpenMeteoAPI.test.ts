import { describe, jest, expect, beforeEach, it } from '@jest/globals';
import axios from 'axios';
import { OpenMeteoAPI } from '../OpenMeteoAPI';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenMeteoAPI', () => {
    let api: OpenMeteoAPI;

    beforeEach(() => {
        api = new OpenMeteoAPI();
        jest.clearAllMocks();
    });

    describe('fetchWeatherData', () => {
        const mockWeatherResponse = {
            data: {
                daily: {
                    time: ['2024-03-20'],
                    weather_code: [1],
                    temperature_2m_max: [25],
                    temperature_2m_min: [15],
                    sunrise: ['06:00'],
                    sunset: ['18:00'],
                    rain_sum: [0],
                    wind_speed_10m_max: [10],
                    wind_gusts_10m_max: [15],
                    wind_direction_10m_dominant: [180]
                },
                daily_units: {
                    weather_code: 'wmo code',
                    temperature_2m_max: '°C',
                    temperature_2m_min: '°C',
                    rain_sum: 'mm',
                    wind_speed_10m_max: 'km/h',
                    wind_gusts_10m_max: 'km/h',
                    wind_direction_10m_dominant: '°'
                }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                url: 'https://historical-forecast-api.open-meteo.com/v1/forecast'
            }
        };

        it('should fetch and parse weather data correctly', async () => {
            mockedAxios.get.mockResolvedValueOnce(mockWeatherResponse);

            const result = await api.fetchWeatherData(0, 0);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                time: '2024-03-20',
                weatherCode: '1',
                temperatureMax: '25 °C',
                temperatureMin: '15 °C',
                sunrise: '06:00',
                sunset: '18:00',
                rainSum: '0 mm',
                windSpeed: '10 km/h',
                windGusts: '15 km/h',
                windDirection: '180 °'
            });
        });

        it('should return empty array when response is null', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: null,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                    url: 'https://historical-forecast-api.open-meteo.com/v1/forecast'
                }
            });

            const result = await api.fetchWeatherData(0, 0);

            expect(result).toEqual([]);
        });

        it('should throw error when request fails', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

            await expect(api.fetchWeatherData(0, 0)).rejects.toThrow('API Error');
        });
    });

    describe('fetchGeocodeData', () => {
        const mockGeocodeResponse = {
            data: {
                results: [{
                    latitude: -23.5505,
                    longitude: -46.6333,
                    elevation: 760,
                    name: 'São Paulo',
                    admin1: 'São Paulo',
                    country: 'Brazil',
                    country_code: 'BR',
                    timezone: 'America/Sao_Paulo'
                }]
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                url: 'https://geocoding-api.open-meteo.com/v1/search'
            }
        };

        it('should fetch and parse geocode data correctly', async () => {
            mockedAxios.get.mockResolvedValueOnce(mockGeocodeResponse);

            const result = await api.fetchGeocodeData('São Paulo');

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                latitude: -23.5505,
                longitude: -46.6333,
                elevation: '760m',
                name: 'São Paulo',
                admin: 'São Paulo',
                country: 'Brazil',
                countryCode: 'BR',
                timezone: 'America/Sao_Paulo'
            });
        });

        it('should return empty array when response is null', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: null,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                    url: 'https://geocoding-api.open-meteo.com/v1/search'
                }
            });

            const result = await api.fetchGeocodeData('Invalid Location');

            expect(result).toEqual([]);
        });

        it('should throw error when request fails', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

            await expect(api.fetchGeocodeData('São Paulo')).rejects.toThrow('API Error');
        });
    });

    describe('URLs and parameters', () => {
        it('should call weather forecast API with correct parameters', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: null,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                    url: 'https://historical-forecast-api.open-meteo.com/v1/forecast'
                }
            });
            
            await api.fetchWeatherData(-23.5505, -46.6333);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://historical-forecast-api.open-meteo.com/v1/forecast',
                expect.objectContaining({
                    params: expect.objectContaining({
                        latitude: -23.5505,
                        longitude: -46.6333,
                        daily: expect.any(String),
                        timezone: 'auto',
                        models: 'icon_seamless'
                    })
                })
            );
        });

        it('should call geocoding API with correct parameters', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: null,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                    url: 'https://geocoding-api.open-meteo.com/v1/search'
                }
            });
            
            await api.fetchGeocodeData('São Paulo');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://geocoding-api.open-meteo.com/v1/search',
                expect.objectContaining({
                    params: {
                        name: 'São Paulo',
                        count: 5
                    }
                })
            );
        });
    });
}); 