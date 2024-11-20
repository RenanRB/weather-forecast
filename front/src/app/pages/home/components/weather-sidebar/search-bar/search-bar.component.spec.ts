import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { SearchBarComponent } from './search-bar.component';
import { GeocodeService } from '../../../../../services/geocode.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { GeocodeResult } from '../../../../../core/interfaces/geocode.interface';

describe('ShearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let geocodeService: jest.Mocked<GeocodeService>;
  let snackBar: jest.Mocked<MatSnackBar>;

  const mockGeocodeResult: GeocodeResult = {
    name: 'São Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    admin: 'São Paulo',
    elevation: '760',
    country: 'Brazil',
    countryCode: 'BR',
    timezone: 'America/Sao_Paulo'
  };

  beforeEach(async () => {
    const geocodeServiceMock = {
      searchCities: jest.fn()
    };

    const snackBarMock = {
      open: jest.fn().mockReturnValue({
        onAction: () => of({}),
        dismiss: () => {}
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        SharedModule, 
        SearchBarComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: GeocodeService, useValue: geocodeServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    geocodeService = TestBed.inject(GeocodeService) as jest.Mocked<GeocodeService>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('City Search', () => {

    it('should handle city selection', () => {
      const emitSpy = jest.spyOn(component.onCitySelected, 'emit');
      const event = {
        option: {
          value: mockGeocodeResult
        }
      };

      component.handleCitySelection(event);

      expect(emitSpy).toHaveBeenCalledWith(mockGeocodeResult);
    });

    it('should display city name correctly', () => {
      expect(component.displayFn(mockGeocodeResult)).toBe('São Paulo');
      expect(component.displayFn(null)).toBe('');
    });
  });

  describe('Geolocation', () => {
    const mockPosition = {
      coords: {
        latitude: -23.5505,
        longitude: -46.6333
      }
    };

    const mockGeolocationPositionError = {
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };

    beforeEach(() => {
      Object.defineProperty(globalThis, 'GeolocationPositionError', {
        value: mockGeolocationPositionError,
        configurable: true
      });

      Object.defineProperty(window.navigator, 'geolocation', {
        value: {
          getCurrentPosition: jest.fn()
        },
        configurable: true
      });
    });

    it('should handle successful geolocation', () => {
      const emitSpy = jest.spyOn(component.onCitySelected, 'emit');
      
      (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
        (successCallback) => successCallback(mockPosition)
      );

      component.getCurrentLocation();

      expect(emitSpy).toHaveBeenCalledWith({
        name: 'Current Location',
        latitude: mockPosition.coords.latitude,
        longitude: mockPosition.coords.longitude,
        admin: '',
        elevation: '',
        country: '',
        countryCode: '',
        timezone: '',
      });
    });
  });
}); 