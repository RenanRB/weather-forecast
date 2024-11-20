import { GeocodeResult, GeocodeAdapter } from '../interfaces/GeocodeAdapter';

export class GeocodeService {
    constructor(private readonly geocodeAdapter: GeocodeAdapter) {}

    async getGeocode(location: string): Promise<GeocodeResult[]> {
        this.validateLocation(location);

        try {
            const results = await this.geocodeAdapter.fetchGeocodeData(location);
            this.validateResults(results);
            return results;
        } catch (error) {
            this.handleError(error);
        }
    }

    private validateLocation(location: string): void {
        if (!location || location.trim() === '') {
            throw new Error('Location cannot be empty');
        }
    }

    private validateResults(results: GeocodeResult[]): void {
        if (!results || results.length === 0) {
            throw new Error('No results found for the provided location');
        }
    }

    private handleError(error: unknown): never {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error fetching geocode data');
    }
}