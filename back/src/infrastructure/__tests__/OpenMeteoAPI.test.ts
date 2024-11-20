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
                current: {
                    time: '2024-03-20T12:00',
                    temperature_2m: 72,
                    relative_humidity_2m: 65,
                    apparent_temperature: 75,
                    is_day: 1,
                    weather_code: 1,
                    surface_pressure: 1015,
                    wind_speed_10m: 8,
                    wind_direction_10m: 180,
                    wind_gusts_10m: 12
                },
                current_units: {
                    temperature_2m: '°F',
                    relative_humidity_2m: '%',
                    apparent_temperature: '°F',
                    is_day: 'boolean',
                    surface_pressure: 'hPa',
                    wind_speed_10m: 'mph',
                    wind_direction_10m: '°',
                    wind_gusts_10m: 'mph'
                },
                daily: {
                    time: ['2024-03-20'],
                    weather_code: [1],
                    temperature_2m_max: [77],
                    temperature_2m_min: [59],
                    sunrise: ['06:00'],
                    sunset: ['18:00'],
                    rain_sum: [0.5],
                    wind_speed_10m_max: [15],
                    wind_gusts_10m_max: [20],
                    wind_direction_10m_dominant: [180],
                    uv_index_max: [8],
                    apparent_temperature_max: [80],
                    apparent_temperature_min: [55]
                },
                daily_units: {
                    weather_code: 'wmo code',
                    temperature_2m_max: '°F',
                    temperature_2m_min: '°F',
                    rain_sum: 'inch',
                    wind_speed_10m_max: 'mph',
                    wind_gusts_10m_max: 'mph',
                    wind_direction_10m_dominant: '°',
                    uv_index_max: '',
                    apparent_temperature_max: '°F',
                    apparent_temperature_min: '°F'
                }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {
                url: 'https://api.open-meteo.com/v1/forecast'
            }
        };

        const mockHistoricalResponse = {
            data: {
                daily: {
                    time: ['2024-03-13'],
                    weather_code: [0],
                    temperature_2m_max: [75],
                    temperature_2m_min: [58],
                    sunrise: ['06:15'],
                    sunset: ['18:15'],
                    rain_sum: [0],
                    wind_speed_10m_max: [12],
                    wind_gusts_10m_max: [18],
                    wind_direction_10m_dominant: [200],
                    uv_index_max: [7],
                    apparent_temperature_max: [78],
                    apparent_temperature_min: [56]
                },
                daily_units: {
                    weather_code: 'wmo code',
                    temperature_2m_max: '°F',
                    temperature_2m_min: '°F',
                    rain_sum: 'inch',
                    wind_speed_10m_max: 'mph',
                    wind_gusts_10m_max: 'mph',
                    wind_direction_10m_dominant: '°',
                    uv_index_max: '',
                    apparent_temperature_max: '°F',
                    apparent_temperature_min: '°F'
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
            mockedAxios.get
                .mockResolvedValueOnce(mockWeatherResponse)  // forecast
                .mockResolvedValueOnce(mockHistoricalResponse);  // historical

            const result = await api.fetchWeatherData(0, 0, 'auto');

            expect(result).toEqual({
                forecastUnits: {
                    temperatureMax: '°F',
                    temperatureMin: '°F',
                    rainSum: 'inch',
                    windSpeed: 'mph',
                    windGusts: 'mph',
                    windDirection: '°',
                    uvIndex: '',
                    apparentTemperatureMax: '°F',
                    apparentTemperatureMin: '°F'
                },
                currentWeatherUnits: {
                    humidity: '%',
                    temperature: '°F',
                    apparentTemperature: '°F',
                    windSpeed: 'mph',
                    windDirection: '°',
                    windGusts: 'mph',
                    isDayOrNight: 'boolean',
                    surfacePressure: 'hPa'
                },
                currentWeatherData: {
                    humidity: 65,
                    temperature: 72,
                    apparentTemperature: 75,
                    windSpeed: 8,
                    windDirection: 180,
                    windGusts: 12,
                    isDayOrNight: true,
                    surfacePressure: 1015,
                    weatherCode: 1
                },
                dailyForecast: [{
                    time: '2024-03-20',
                    weatherCode: 1,
                    temperatureMax: 77,
                    temperatureMin: 59,
                    sunrise: '06:00',
                    sunset: '18:00',
                    rainSum: 0.5,
                    windSpeed: 15,
                    windGusts: 20,
                    windDirection: 180,
                    uvIndex: 8,
                    apparentTemperatureMax: 80,
                    apparentTemperatureMin: 55
                }],
                historicalWeatherData: [{
                    time: '2024-03-13',
                    weatherCode: 0,
                    temperatureMax: 75,
                    temperatureMin: 58,
                    sunrise: '06:15',
                    sunset: '18:15',
                    rainSum: 0,
                    windSpeed: 12,
                    windGusts: 18,
                    windDirection: 200,
                    uvIndex: 7,
                    apparentTemperatureMax: 78,
                    apparentTemperatureMin: 56
                }]
            });
        });

        it('should return empty weather result when response is null', async () => {
            const api = new OpenMeteoAPI();
            jest.spyOn(axios, 'get').mockResolvedValue({
                data: null,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                    url: 'https://api.open-meteo.com/v1/forecast'
                }
            });
            
            const result = await api.fetchWeatherData(0, 0, 'auto');
            
            expect(result).toEqual({
                forecastUnits: {},
                dailyForecast: [],
                historicalWeatherData: [],
                currentWeatherUnits: {},
                currentWeatherData: {},
            });
        });

        it('should throw error when request fails', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

            await expect(api.fetchWeatherData(0, 0, 'auto')).rejects.toThrow('API Error');
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
            mockedAxios.get
                .mockResolvedValueOnce({  // forecast API mock
                    data: {
                        daily_units: {},
                        current_units: {},
                        daily: {},
                        current: {}
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {
                        url: 'https://api.open-meteo.com/v1/forecast'
                    }
                })
                .mockResolvedValueOnce({  // historical API mock
                    data: {
                        daily_units: {},
                        daily: {}
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {
                        url: 'https://archive-api.open-meteo.com/v1/archive'
                    }
                });
            
            await api.fetchWeatherData(-23.5505, -46.6333, 'America/Sao_Paulo');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://api.open-meteo.com/v1/forecast',
                expect.objectContaining({
                    params: expect.objectContaining({
                        latitude: -23.5505,
                        longitude: -46.6333,
                        daily: expect.any(String),
                        current: expect.any(String),
                        temperature_unit: 'fahrenheit',
                        wind_speed_unit: 'mph',
                        precipitation_unit: 'inch',
                        timezone: 'America/Sao_Paulo'
                    })
                })
            );
        });

        it('should call geocoding API with correct parameters', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    results: []
                },
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