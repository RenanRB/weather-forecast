import { describe, jest, expect, beforeEach, it } from '@jest/globals';
import { Request, Response } from 'express';
import { GeocodeController } from '../GeocodeController';
import { GeocodeResult } from '../../domain/GeocodeAdapter';
import { GeocodeService } from '../../application/GeocodeService';

jest.mock('../../../infrastructure/OpenMeteoAPI');
jest.mock('../../../application/GeocodeService');

describe('GeocodeController', () => {
    let controller: GeocodeController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        controller = new GeocodeController();
        jsonMock = jest.fn();
        
        mockResponse = {
            json: jsonMock,
            status: jest.fn().mockReturnThis()
        } as Partial<Response> as Response;
    });

    it('should return 400 when location is missing', async () => {
        mockRequest = {
            query: {}
        };

        await controller.getGeocode(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Location parameter is required' });
    });

    it('should return 400 when source is invalid', async () => {
        mockRequest = {
            query: {
                location: 'São Paulo',
                source: 'invalid-source'
            }
        };

        await controller.getGeocode(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'No valid adapter was selected' });
    });

    it('should return geocode data successfully', async () => {
        const mockGeocodeResult: GeocodeResult[] = [{
            latitude: -23.5505,
            longitude: -46.6333,
            elevation: '760',
            name: 'São Paulo',
            admin: 'São Paulo',
            country: 'Brazil',
            countryCode: 'BR',
            timezone: 'America/Sao_Paulo'
        }];

        mockRequest = {
            query: {
                location: 'São Paulo',
                source: 'open-meteo'
            }
        };

        const geocodeServiceMock = GeocodeService.prototype.getGeocode as jest.MockedFunction<typeof GeocodeService.prototype.getGeocode>;
        geocodeServiceMock.mockResolvedValue(mockGeocodeResult);

        await controller.getGeocode(mockRequest as Request, mockResponse as Response);

        expect(jsonMock).toHaveBeenCalledWith(mockGeocodeResult);
    });

    it('should return 500 when service throws error', async () => {
        mockRequest = {
            query: {
                location: 'São Paulo',
                source: 'open-meteo'
            }
        };

        const geocodeServiceMock = GeocodeService.prototype.getGeocode as jest.MockedFunction<typeof GeocodeService.prototype.getGeocode>;
        geocodeServiceMock.mockRejectedValue(new Error('Service error'));

        await controller.getGeocode(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Error fetching address' });
    });

    it('should return 404 when no results are found', async () => {
        mockRequest = {
            query: {
                location: 'No results found',
                source: 'open-meteo'
            }
        };

        const geocodeServiceMock = GeocodeService.prototype.getGeocode as jest.MockedFunction<typeof GeocodeService.prototype.getGeocode>;
        geocodeServiceMock.mockRejectedValue(new Error('No results found for the provided location'));

        await controller.getGeocode(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'No results found for the provided location' });
    });

    it('should return 400 when location is empty', async () => {
        mockRequest = {
            query: {
                location: '',
                source: 'open-meteo'
            }
        };

        await controller.getGeocode(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Location parameter is required' });
    });
}); 