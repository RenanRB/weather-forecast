export interface GeocodeResult {
    latitude: number;
    longitude: number;
    elevation: string;
    name: string;
    admin: string;
    country: string;
    countryCode: string;
    timezone: string;
}

export interface GeocodeAdapter {
    fetchGeocodeData(location: string): Promise<GeocodeResult[]>;
}