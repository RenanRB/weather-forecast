import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherForecastComponent } from './weather-forecast.component';
import { WeatherIconService } from '../../../../services/weather-icon.service';
import { WeatherData, WeatherResponse } from '../../../../core/interfaces/weather.interface';

describe('WeatherForecastComponent', () => {
  let component: WeatherForecastComponent;
  let fixture: ComponentFixture<WeatherForecastComponent>;
  let weatherIconService: jest.Mocked<WeatherIconService>;

  const mockWeatherData: WeatherData = {
    time: '2024-03-20',
    temperatureMax: 25,
    temperatureMin: 15,
    sunrise: '06:00',
    sunset: '18:00',
    rainSum: 0,
    windSpeed: 10,
    windDirection: 180,
    windGusts: 15,
    weatherCode: 0,
    uvIndex: 5,
    apparentTemperatureMax: 26,
    apparentTemperatureMin: 14
  };

  const mockWeatherResponse: WeatherResponse = {
    forecastUnits: {
      temperatureMax: '°C',
      temperatureMin: '°C',
      rainSum: 'mm',
      windSpeed: 'km/h',
      windGusts: 'km/h',
      windDirection: '°',
      uvIndex: '',
      apparentTemperatureMax: '°C',
      apparentTemperatureMin: '°C'
    },
    dailyForecast: [mockWeatherData],
    historicalWeatherData: [mockWeatherData],
    currentWeatherData: {
      humidity: 70,
      temperature: 20,
      apparentTemperature: 21,
      windSpeed: 8,
      windDirection: 90,
      windGusts: 12,
      isDayOrNight: true,
      surfacePressure: 1013,
      weatherCode: 0
    },
    currentWeatherUnits: {
      humidity: '%',
      temperature: '°C',
      apparentTemperature: '°C',
      windSpeed: 'km/h',
      windDirection: '°',
      windGusts: 'km/h',
      isDayOrNight: '',
      surfacePressure: 'hPa'
    }
  };

  beforeEach(async () => {
    weatherIconService = {
      getWeatherIcon: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [WeatherForecastComponent],
      providers: [
        { provide: WeatherIconService, useValue: weatherIconService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input properties correctly', () => {
    component.weatherList = [mockWeatherData];
    component.weatherResponse = mockWeatherResponse;
    
    expect(component.weatherList).toEqual([mockWeatherData]);
    expect(component.weatherResponse).toEqual(mockWeatherResponse);
  });

  it('should call weatherIconService.getWeatherIcon with correct parameters', () => {
    const isDay = true;
    const weatherCode = 0;
    const mockIconPath = 'path/to/icon.svg';
    
    weatherIconService.getWeatherIcon.mockReturnValue(mockIconPath);
    
    const result = component.getWeatherIcon(isDay, weatherCode);
    
    expect(weatherIconService.getWeatherIcon).toHaveBeenCalledWith(isDay, weatherCode);
    expect(result).toBe(mockIconPath);
  });
}); 