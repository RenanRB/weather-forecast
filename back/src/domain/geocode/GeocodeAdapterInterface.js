class GeocodeAdapterInterface {
    fetchGeocodeData(location) {
        throw new Error("Method 'fetchGeocodeData(location)' must be implemented.");
    }
}

module.exports = GeocodeAdapterInterface;