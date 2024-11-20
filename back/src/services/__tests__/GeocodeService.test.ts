import { describe, jest, beforeEach, it, expect } from '@jest/globals';
import { GeocodeService } from '../GeocodeService';
import { GeocodeAdapter, GeocodeResult } from '../../domain/GeocodeAdapter';

describe('GeocodeService', () => {
    let geocodeService: GeocodeService;
    let mockGeocodeAdapter: jest.Mocked<GeocodeAdapter>;

    const mockResult: GeocodeResult[] = [
        {
            latitude: -23.5505,
            longitude: -46.6333,
            elevation: "760",
            name: "São Paulo",
            admin: "São Paulo",
            country: "Brazil",
            countryCode: "BR",
            timezone: "America/Sao_Paulo"
        }
    ];

    beforeEach(() => {
        mockGeocodeAdapter = {
            fetchGeocodeData: jest.fn()
        };
        geocodeService = new GeocodeService(mockGeocodeAdapter);
    });

    describe('getGeocode', () => {
        it('should return geocode data successfully', async () => {
            mockGeocodeAdapter.fetchGeocodeData.mockResolvedValue(mockResult);

            const result = await geocodeService.getGeocode('São Paulo');

            expect(result).toEqual(mockResult);
            expect(mockGeocodeAdapter.fetchGeocodeData).toHaveBeenCalledWith('São Paulo');
            expect(mockGeocodeAdapter.fetchGeocodeData).toHaveBeenCalledTimes(1);
        });

        it('should throw error when location is empty', async () => {
            await expect(geocodeService.getGeocode('')).rejects
                .toThrow('Location cannot be empty');
        });

        it('should throw error when location is only whitespace', async () => {
            await expect(geocodeService.getGeocode('   ')).rejects
                .toThrow('Location cannot be empty');
        });

        it('should throw error when no results are found', async () => {
            mockGeocodeAdapter.fetchGeocodeData.mockResolvedValue([]);

            await expect(geocodeService.getGeocode('Invalid Location')).rejects
                .toThrow('No results found for the provided location');
        });

        it('should handle adapter errors', async () => {
            const error = new Error('API Error');
            mockGeocodeAdapter.fetchGeocodeData.mockRejectedValue(error);

            await expect(geocodeService.getGeocode('São Paulo')).rejects
                .toThrow('API Error');
        });

        it('should handle unknown errors', async () => {
            mockGeocodeAdapter.fetchGeocodeData.mockRejectedValue('Unknown error');

            await expect(geocodeService.getGeocode('São Paulo')).rejects
                .toThrow('Error fetching geocode data');
        });
    });
}); 