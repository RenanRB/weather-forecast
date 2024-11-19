import { TestBed } from '@angular/core/testing';

import { SelectedCityService } from './selected-city.service';

describe('SelectedCityService', () => {
  let service: SelectedCityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedCityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
