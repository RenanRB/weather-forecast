const DTOInterface = require('../DTOInterface');

class Geocode extends DTOInterface {
    constructor(results) {
        super();
        this.addresses = results.map(result => ({
            id: result.id,
            name: result.name,
            countryCode: result.country_code,
            country: result.country,
            state: result.admin1,
            latitude: result.latitude,
            longitude: result.longitude,
        }));
    }

    toJSON() {
        return {
            type: 'geocode',
            addresses: this.addresses
        };
    }
}

module.exports = Geocode;
