import { GeocodeResult, GeocodeAdapter } from '../domain/GeocodeAdapter';

export class GeocodeService {
    constructor(private readonly geocodeAdapter: GeocodeAdapter) {}

    async getGeocode(location: string): Promise<GeocodeResult[]> {
        return this.geocodeAdapter.fetchGeocodeData(location);
    }
}