import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeocodeService } from '../geocode.service';
import { environment } from '../../../environments/environment';
import { GeocodeResult } from '../../core/interfaces/geocode.interface';

describe('GeocodeService', () => {
  let service: GeocodeService;
  let httpMock: HttpTestingController;

  const mockGeocodeResult: GeocodeResult[] = [{
    latitude: -23.5505,
    longitude: -46.6333,
    elevation: '760m',
    name: 'New York',
    admin: 'New York',
    country: 'United States',
    countryCode: 'US',
    timezone: 'America/New_York'
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeocodeService]
    });
    service = TestBed.inject(GeocodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchCities', () => {
    it('should return empty array when query is less than 3 characters', () => {
      service.searchCities('ab').subscribe(result => {
        expect(result).toEqual([]);
      });
    });

    it('should return empty array when query is null or empty', () => {
      service.searchCities('').subscribe(result => {
        expect(result).toEqual([]);
      });
    });

    it('should call API and return results when query is valid', () => {
      const query = 'New York';

      service.searchCities(query).subscribe(results => {
        expect(results).toEqual(mockGeocodeResult);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cities?location=${query}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGeocodeResult);
    });

    it('should return empty array on API error', () => {
      const query = 'New York';

      service.searchCities(query).subscribe(results => {
        expect(results).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/cities?location=${query}`);
      req.error(new ProgressEvent('error'));
    });
  });
}); 