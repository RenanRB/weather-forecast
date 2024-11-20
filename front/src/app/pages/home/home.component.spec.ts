import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { WeatherService } from '../../services/weather.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeatherIconService } from '../../services/weather-icon.service';
import { SelectedCityService } from './services/selected-city.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { GeocodeResult } from '../../core/interfaces/geocode.interface';
import { WeatherResponse } from '../../core/interfaces/weather.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let weatherService: jest.Mocked<WeatherService>;
  let snackBar: jest.Mocked<MatSnackBar>;
  let selectedCityService: jest.Mocked<SelectedCityService>;
  let weatherIconService: jest.Mocked<WeatherIconService>;

  const mockCity: GeocodeResult = {
    latitude: 40.71427,
    longitude: -74.00597,
    elevation: '10m',
    name: 'New York',
    admin: 'New York',
    country: 'United States',
    countryCode: 'US',
    timezone: 'America/New_York'
  };

  const mockWeatherResponse: WeatherResponse = {
    forecastUnits: {} as any,
    dailyForecast: [
      { time: '2024-03-20', temperatureMax: 20 } as any,
      { time: '2024-03-21', temperatureMax: 22 } as any,
    ],
    historicalWeatherData: [
      { time: '2024-03-18', temperatureMax: 18 } as any,
      { time: '2024-03-19', temperatureMax: 19 } as any,
    ],
    currentWeatherData: {} as any,
    currentWeatherUnits: {} as any,
  };

  beforeEach(async () => {
    const weatherServiceMock = {
      getWeather: jest.fn()
    };

    const snackBarMock = {
      open: jest.fn()
    };

    const selectedCityServiceMock = {
      selectedCity$: of(mockCity),
      saveCity: jest.fn()
    };

    const weatherIconServiceMock = {
      getWeatherIcon: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: WeatherService, useValue: weatherServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: SelectedCityService, useValue: selectedCityServiceMock },
        { provide: WeatherIconService, useValue: weatherIconServiceMock }
      ]
    }).compileComponents();

    weatherService = TestBed.inject(WeatherService) as jest.Mocked<WeatherService>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    selectedCityService = TestBed.inject(SelectedCityService) as jest.Mocked<SelectedCityService>;
    weatherIconService = TestBed.inject(WeatherIconService) as jest.Mocked<WeatherIconService>;

    weatherService.getWeather.mockReturnValue(of(mockWeatherResponse));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load weather data for default city if no city is selected', () => {
      selectedCityService.selectedCity$ = new BehaviorSubject<GeocodeResult | null>(null);
      component.ngOnInit();
      
      expect(weatherService.getWeather).toHaveBeenCalledWith(40.71427, -74.00597);
    });

    it('should load weather data for selected city', () => {
      component.ngOnInit();
      
      expect(weatherService.getWeather).toHaveBeenCalledWith(
        mockCity.latitude,
        mockCity.longitude
      );
    });
  });

  describe('handleCitySelection', () => {
    it('should update selected city and load weather data', () => {
      const newCity: GeocodeResult = {
        ...mockCity,
        name: 'London',
        latitude: 51.5074,
        longitude: -0.1278
      };

      component.handleCitySelection(newCity);

      expect(selectedCityService.saveCity).toHaveBeenCalledWith(newCity);
      expect(weatherService.getWeather).toHaveBeenCalledWith(
        newCity.latitude,
        newCity.longitude
      );
    });
  });

  describe('loadWeatherData', () => {

    it('should update loading state correctly', () => {
      component.loadWeatherData(mockCity);
      
      expect(component.isLoading).toBeFalsy();
      expect(component.weatherResponse).toEqual(mockWeatherResponse);
    });
  });

  describe('weatherListToShow', () => {
    it('should return historical data when showLastWeek is true', () => {
      component.weatherResponse = { ...mockWeatherResponse };
      component.showLastWeek = true;

      expect(component.weatherListToShow).toEqual(
        mockWeatherResponse.historicalWeatherData.slice(1, -1)
      );
    });
  });

  describe('getWeatherIcon', () => {
    it('should call weatherIconService with correct parameters', () => {
      const isDay = true;
      const code = 800;
      
      component.getWeatherIcon(isDay, code);
      
      expect(weatherIconService.getWeatherIcon).toHaveBeenCalledWith(isDay, code);
    });
  });
}); 