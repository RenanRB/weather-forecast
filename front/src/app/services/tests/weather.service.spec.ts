import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from '../weather.service';
import { environment } from '../../../environments/environment';
import { WeatherResponse } from '../../core/interfaces/weather.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET call to obtain weather data', (done) => {
    // Arrange
    const mockResponse: WeatherResponse = {
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
      dailyForecast: [{
        time: '2024-03-20',
        temperatureMax: 25,
        temperatureMin: 18,
        sunrise: '06:00',
        sunset: '18:00',
        rainSum: 0,
        windSpeed: 10,
        windDirection: 180,
        windGusts: 15,
        weatherCode: 0,
        uvIndex: 5,
        apparentTemperatureMax: 27,
        apparentTemperatureMin: 16
      }],
      historicalWeatherData: [],
      currentWeatherData: {
        humidity: 65,
        temperature: 25,
        apparentTemperature: 26,
        windSpeed: 10,
        windDirection: 180,
        windGusts: 15,
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
    
    const lat = -23.5505;
    const lon = -46.6333;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Act
    service.getWeather(lat, lon).subscribe({
      next: (response) => {
        expect(response).toEqual(mockResponse);
        done();
      },
      error: done.fail
    });

    // Assert
    const req = httpMock.expectOne(
      `${environment.apiUrl}/weather?lat=${lat}&lon=${lon}&timezone=${timezone}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle API call errors', (done) => {
    // Arrange
    const lat = -23.5505;
    const lon = -46.6333;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const errorMessage = 'Error fetching weather data';

    // Act
    service.getWeather(lat, lon).subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
        done();
      }
    });

    // Assert
    const req = httpMock.expectOne(
      `${environment.apiUrl}/weather?lat=${lat}&lon=${lon}&timezone=${timezone}`
    );
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});