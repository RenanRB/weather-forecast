import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentWeatherComponent } from './current-weather.component';
import { WeatherIconService } from '../../../../../services/weather-icon.service';
import { FavoriteCitiesService } from '../../../services/favorite-cities.service';
import { SelectedCityService } from '../../../services/selected-city.service';
import { BehaviorSubject } from 'rxjs';
import { GeocodeResult } from '../../../../../core/interfaces/geocode.interface';
import { WeatherResponse } from '../../../../../core/interfaces/weather.interface';

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;
  let weatherIconService: jest.Mocked<WeatherIconService>;
  let favoriteCitiesService: jest.Mocked<FavoriteCitiesService>;
  let selectedCityService: jest.Mocked<SelectedCityService>;

  const mockCity: GeocodeResult = {
    name: 'São Paulo',
    country: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
    admin: 'São Paulo',
    countryCode: 'BR',
    elevation: '760',
    timezone: 'America/Sao_Paulo'
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
    dailyForecast: [],
    historicalWeatherData: [],
    currentWeatherData: {
      humidity: 80,
      temperature: 25,
      apparentTemperature: 26,
      windSpeed: 10,
      windDirection: 180,
      windGusts: 15,
      isDayOrNight: true,
      surfacePressure: 1013,
      weatherCode: 1
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

    favoriteCitiesService = {
      isFavorite: jest.fn(),
      toggleFavorite: jest.fn(),
      favoriteCities$: new BehaviorSubject([])
    } as any;

    selectedCityService = {
      selectedCity$: new BehaviorSubject<GeocodeResult | null>(null)
    } as any;

    await TestBed.configureTestingModule({
      imports: [CurrentWeatherComponent],
      providers: [
        { provide: WeatherIconService, useValue: weatherIconService },
        { provide: FavoriteCitiesService, useValue: favoriteCitiesService },
        { provide: SelectedCityService, useValue: selectedCityService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update weather response when input changes', () => {
    component.weatherResponse = mockWeatherResponse;
    expect(component.weatherResponse).toEqual(mockWeatherResponse);
  });

  it('should update selected city and check if it is favorite', () => {
    favoriteCitiesService.isFavorite.mockReturnValue(true);
    component.citySelected = mockCity;
    
    expect(component.citySelected).toEqual(mockCity);
    expect(component.isFavorite).toBeTruthy();
    expect(favoriteCitiesService.isFavorite).toHaveBeenCalledWith(mockCity);
  });

  it('should get weather icon', () => {
    const mockIcon = 'sunny';
    weatherIconService.getWeatherIcon.mockReturnValue(mockIcon);
    
    const result = component.getWeatherIcon(true, 1);
    
    expect(result).toBe(mockIcon);
    expect(weatherIconService.getWeatherIcon).toHaveBeenCalledWith(true, 1);
  });

  it('should toggle favorite status', () => {
    component.citySelected = mockCity;
    favoriteCitiesService.isFavorite.mockReturnValue(false);
    
    component.toggleFavorite();
    
    expect(favoriteCitiesService.toggleFavorite).toHaveBeenCalledWith(mockCity);
    expect(favoriteCitiesService.isFavorite).toHaveBeenCalledWith(mockCity);
  });

  it('should update isFavorite when favoriteCities$ emits', () => {
    component.citySelected = mockCity;
    favoriteCitiesService.isFavorite.mockReturnValue(true);
    
    favoriteCitiesService.favoriteCities$.next([mockCity]);
    
    expect(component.isFavorite).toBeTruthy();
    expect(favoriteCitiesService.isFavorite).toHaveBeenCalledWith(mockCity);
  });

  it('should update citySelected when selectedCity$ emits', () => {
    favoriteCitiesService.isFavorite.mockReturnValue(false);
    
    selectedCityService.selectedCity$.next(mockCity);
    
    expect(component.citySelected).toEqual(mockCity);
    expect(component.isFavorite).toBeFalsy();
  });
}); 