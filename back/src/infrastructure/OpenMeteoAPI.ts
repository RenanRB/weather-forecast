import axios from 'axios';
import { GeocodeAdapter, GeocodeResult } from '../domain/GeocodeAdapter';
import { CurrentWeatherData, CurrentWeatherUnits, WeatherData, WeatherUnits, WeatherAdapter, WeatherResult } from '../domain/WeatherAdapter';

const DAILY_PARAMS = 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,apparent_temperature_max,apparent_temperature_min,uv_index_max';
const CURRENT_PARAMS = 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m';
const TEMPERATURE_UNIT = 'fahrenheit';
const WIND_SPEED_UNIT = 'mph';
const PRECIPITATION_UNIT = 'inch';
const FORECAST_URL = 'https://api.open-meteo.com';
const HISTORICAL_URL = 'https://historical-forecast-api.open-meteo.com';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com';

export class OpenMeteoAPI implements GeocodeAdapter, WeatherAdapter {
    async fetchWeatherData(
        lat: number, 
        lon: number,
        timezone: string
    ): Promise<WeatherResult> {
        const responseDaily = await axios.get(`${FORECAST_URL}/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                daily: DAILY_PARAMS,
                current: CURRENT_PARAMS,
                temperature_unit: TEMPERATURE_UNIT,
                wind_speed_unit: WIND_SPEED_UNIT,
                precipitation_unit: PRECIPITATION_UNIT,
                timezone: timezone
            }
        });

        if (!responseDaily?.data) {
            return {
                forecastUnits: {} as WeatherUnits,
                dailyForecast: [],
                historicalWeatherData: [],
                currentWeatherUnits: {} as CurrentWeatherUnits,
                currentWeatherData: {} as CurrentWeatherData,
            } as WeatherResult;
        }

        const responseHistorical = await axios.get(`${HISTORICAL_URL}/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                past_days: 7,
                daily: DAILY_PARAMS,
                temperature_unit: TEMPERATURE_UNIT,
                wind_speed_unit: WIND_SPEED_UNIT,
                precipitation_unit: PRECIPITATION_UNIT,
                timezone: timezone,
            }
        });

        return {
            forecastUnits: this.toForecastUnitsDTO(responseDaily?.data),
            dailyForecast: this.toForecastDTO(responseDaily?.data),
            historicalWeatherData: this.toForecastDTO(responseHistorical?.data),
            currentWeatherUnits: this.toCurrentForecastUnitsDTO(responseDaily?.data),
            currentWeatherData: this.toCurrentForecastDTO(responseDaily?.data),
        } as WeatherResult;
    }

    async fetchGeocodeData(location: string): Promise<GeocodeResult[]> {
        const response = await axios.get(`${GEOCODING_URL}/v1/search`, {
            params: {
                name: location,
                count: 5
            }
        });

        return this.toGeocodeDTO(response?.data);
    }

    private toForecastDTO(data: any): WeatherData[] {
        if (!data?.daily?.time?.length) {
            return [];
        }
        const { daily } = data;
        
        return daily.time.map((time: string, index: number) => ({
            time: time,
            weatherCode: daily.weather_code[index],
            temperatureMax: daily.temperature_2m_max[index],
            temperatureMin: daily.temperature_2m_min[index],
            sunrise: daily.sunrise[index],
            sunset: daily.sunset[index],
            rainSum: daily.rain_sum[index],
            windSpeed:  daily.wind_speed_10m_max[index],
            windGusts: daily.wind_gusts_10m_max[index],
            windDirection: daily.wind_direction_10m_dominant[index],
            uvIndex: daily.uv_index_max[index],
            apparentTemperatureMax: daily.apparent_temperature_max[index],
            apparentTemperatureMin: daily.apparent_temperature_min[index],
        }));
    }

    private toForecastUnitsDTO(data: any): WeatherUnits {
        if (!data?.daily_units) {
            return {} as WeatherUnits;
        }
        const { daily_units } = data;
        return {
            temperatureMax: daily_units.temperature_2m_max,
            temperatureMin: daily_units.temperature_2m_min,
            rainSum: daily_units.rain_sum,
            windSpeed: daily_units.wind_speed_10m_max,
            windGusts: daily_units.wind_gusts_10m_max,
            windDirection: daily_units.wind_direction_10m_dominant,
            uvIndex: daily_units.uv_index_max,
            apparentTemperatureMax: daily_units.apparent_temperature_max,
            apparentTemperatureMin: daily_units.apparent_temperature_min,
        };
    }

    private toCurrentForecastUnitsDTO(data: any): CurrentWeatherUnits {
        if (!data?.current_units) {
            return {} as CurrentWeatherUnits;
        }
        const { current_units } = data;
        return {
            humidity: current_units.relative_humidity_2m,
            temperature: current_units.temperature_2m,
            apparentTemperature: current_units.apparent_temperature,
            windSpeed: current_units.wind_speed_10m,
            windDirection: current_units.wind_direction_10m,
            windGusts: current_units.wind_gusts_10m,
            isDayOrNight: current_units.is_day,
            surfacePressure: current_units.surface_pressure,
        };
    }

    private toCurrentForecastDTO(data: any): CurrentWeatherData {
        if (!data) {
            return {} as CurrentWeatherData;
        }
        const { current } = data;
        return {
            humidity: current?.relative_humidity_2m,
            temperature: current?.temperature_2m,
            apparentTemperature: current?.apparent_temperature,
            windSpeed: current?.wind_speed_10m,
            windDirection: current?.wind_direction_10m,
            windGusts: current?.wind_gusts_10m,
            isDayOrNight: Boolean(current?.is_day),
            surfacePressure: current?.surface_pressure,
            weatherCode: current?.weather_code,
        };
    }

    private toGeocodeDTO(data: any): GeocodeResult[] {
        if (!data?.results?.length) {
            return [];
        }

        const { results } = data;   

        return results.map((city: any) => ({
            latitude: city.latitude,
            longitude: city.longitude,
            elevation: `${city.elevation}m`,
            name: city.name,
            admin: city.admin1 ?? city.admin2 ?? city.admin3,
            country: city.country,
            countryCode: city.country_code,
            timezone: city.timezone
        }));
    }
}
