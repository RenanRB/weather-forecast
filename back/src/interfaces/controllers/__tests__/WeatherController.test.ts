import { describe, jest, expect, beforeEach, it } from '@jest/globals';
import { Request, Response } from 'express';
import { WeatherController } from '../WeatherController';
import { WeatherService } from '../../../application/WeatherService';

jest.mock('../../../application/WeatherService');
jest.mock('../../../infrastructure/OpenMeteoAPI');

describe('WeatherController', () => {
    let weatherController: WeatherController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        weatherController = new WeatherController();
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnThis();
        mockResponse = {
            json: jsonMock,
            status: statusMock
        } as Partial<Response>;
    });

    it('should return 400 error when latitude and longitude are not provided', async () => {
        mockRequest = {
            query: {}
        };

        await weatherController.getWeather(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Latitude and longitude are required' });
    });

    it('should return 400 error when source is invalid', async () => {
        mockRequest = {
            query: {
                lat: '10',
                lon: '20',
                source: 'invalid-source'
            }
        };

        await weatherController.getWeather(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'No valid adapter was selected' });
    });

    it('should return 400 error when latitude or longitude are not valid numbers', async () => {
        mockRequest = {
            query: {
                lat: 'invalid',
                lon: '20'
            }
        };

        await weatherController.getWeather(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Latitude and longitude must be valid numbers' });
    });

    it('should return weather data successfully', async () => {
        const mockWeatherData = [{
            time: '2024-01-01',
            weatherCode: 0,
            temperatureMax: 25,
            temperatureMin: 15,
            sunrise: '06:00',
            sunset: '18:00', 
            rainSum: 0,
            windSpeed: 10,
            windGusts: 15,
            windDirection: 180
        }];

        const weatherServiceMock = WeatherService.prototype.getWeather as jest.MockedFunction<typeof WeatherService.prototype.getWeather>;
        weatherServiceMock.mockResolvedValue(mockWeatherData);

        mockRequest = {
            query: {
                lat: '10',
                lon: '20',
                source: 'open-meteo'
            }
        };

        await weatherController.getWeather(mockRequest as Request, mockResponse as Response);

        expect(jsonMock).toHaveBeenCalledWith(mockWeatherData);
    });

    it('should return 500 error when fetching data fails', async () => {
        const weatherServiceMock = WeatherService.prototype.getWeather as jest.MockedFunction<typeof WeatherService.prototype.getWeather>;
        weatherServiceMock.mockRejectedValue(new Error('Service error'));

        mockRequest = {
            query: {
                lat: '10',
                lon: '20'
            }
        };

        await weatherController.getWeather(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Error fetching weather forecast' });
    });
}); 