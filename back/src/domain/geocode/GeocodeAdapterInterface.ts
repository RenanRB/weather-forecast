export interface GeocodeResult {
    formatted: string;
    latitude: number;
    longitude: number;
}

export interface GeocodeAdapterInterface {
    fetchGeocodeData(location: string): Promise<GeocodeResult[]>;
}