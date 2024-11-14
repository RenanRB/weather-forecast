import axios from 'axios';
import { GeocodeAdapter, GeocodeResult } from '../domain/GeocodeAdapter';
import { WeatherAdapter, WeatherResult } from '../domain/WeatherAdapter';

const DAILY_PARAMS = 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant';
const HISTORICAL_URL = 'https://historical-forecast-api.open-meteo.com';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com';

export class OpenMeteoAPI implements GeocodeAdapter, WeatherAdapter {
    async fetchWeatherData(
        lat: number, 
        lon: number,
    ): Promise<WeatherResult[]> {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const formatDate = (date: Date): string => {
            return date.toISOString().split('T')[0];
        };

        const response = await axios.get(`${HISTORICAL_URL}/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                start_date: formatDate(sevenDaysAgo),
                end_date: formatDate(today),
                daily: DAILY_PARAMS,
                timezone: 'auto',
                models: 'icon_seamless'
            }
        });

        return this.parseWeatherData(response?.data);
    }

    async fetchGeocodeData(location: string): Promise<GeocodeResult[]> {
        const response = await axios.get(`${GEOCODING_URL}/v1/search`, {
            params: {
                name: location,
                count: 5
            }
        });

        return this.parseGeocodeData(response?.data);
    }

    private parseWeatherData(data: any): WeatherResult[] {
        if (!data) {
            return [];
        }
        const { daily, daily_units } = data;
        
        return daily.time.map((time: string, index: number) => ({
            time: `${time}`,
            weatherCode: `${daily.weather_code[index]}`,
            temperatureMax: `${daily.temperature_2m_max[index]} ${daily_units.temperature_2m_max}`,
            temperatureMin: `${daily.temperature_2m_min[index]} ${daily_units.temperature_2m_min}`,
            sunrise: `${daily.sunrise[index]}`,
            sunset: `${daily.sunset[index]}`,
            rainSum: `${daily.rain_sum[index]} ${daily_units.rain_sum}`,
            windSpeed: `${daily.wind_speed_10m_max[index]} ${daily_units.wind_speed_10m_max}`,
            windGusts: `${daily.wind_gusts_10m_max[index]} ${daily_units.wind_gusts_10m_max}`,
            windDirection: `${daily.wind_direction_10m_dominant[index]} ${daily_units.wind_direction_10m_dominant}`
        }));
    }

    private parseGeocodeData(data: any): GeocodeResult[] {
        if (!data) {
            return [];
        }

        const { results } = data;   

        return results.map((city: any) => ({
            latitude: city.latitude,
            longitude: city.longitude,
            elevation: `${city.elevation}m`,
            name: city.name,
            admin: city.admin1,
            country: city.country,
            countryCode: city.country_code,
            timezone: city.timezone
        }));
    }
}
