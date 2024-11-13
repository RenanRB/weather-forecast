import { GeocodeResult, GeocodeAdapterInterface } from '../domain/geocode/GeocodeAdapterInterface';

export class GeocodeService {
    constructor(private readonly geocodeAdapter: GeocodeAdapterInterface) {}

    async getGeocode(location: string): Promise<GeocodeResult[]> {
        return this.geocodeAdapter.fetchGeocodeData(location);
    }
}