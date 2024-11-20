import { TestBed } from '@angular/core/testing';
import { WeatherIconService } from '../weather-icon.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

describe('WeatherIconService', () => {
  let service: WeatherIconService;
  let matIconRegistry: jest.Mocked<MatIconRegistry>;
  let domSanitizer: jest.Mocked<DomSanitizer>;

  beforeEach(() => {
    const matIconSpy = {
      addSvgIcon: jest.fn()
    } as unknown as jest.Mocked<MatIconRegistry>;
    
    const domSanitizerSpy = {
      bypassSecurityTrustResourceUrl: jest.fn()
    } as unknown as jest.Mocked<DomSanitizer>;

    TestBed.configureTestingModule({
      providers: [
        WeatherIconService,
        { provide: MatIconRegistry, useValue: matIconSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy }
      ]
    });

    service = TestBed.inject(WeatherIconService);
    matIconRegistry = TestBed.inject(MatIconRegistry) as jest.Mocked<MatIconRegistry>;
    domSanitizer = TestBed.inject(DomSanitizer) as jest.Mocked<DomSanitizer>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerWeatherIcons', () => {
    it('should register icons for day and night for each weather code', () => {
      service.registerWeatherIcons();
      
      const totalWeatherCodes = 28;
      expect(matIconRegistry.addSvgIcon).toHaveBeenCalledTimes(totalWeatherCodes * 2);
      expect(domSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(totalWeatherCodes * 2);
    });
  });

  describe('getWeatherIcon', () => {
    it('should return the correct day icon', () => {
      const result = service.getWeatherIcon(true, 45);
      expect(result).toBe('weather-day-45');
    });

    it('should return the correct night icon', () => {
      const result = service.getWeatherIcon(false, 45);
      expect(result).toBe('weather-night-45');
    });

    it('should use code 0 as default when no code is provided', () => {
      const result = service.getWeatherIcon(true);
      expect(result).toBe('weather-day-0');
    });
  });
}); 