import { TestBed } from '@angular/core/testing';

import { FavoriteCitiesService } from './favorite-cities.service';

describe('FavoriteCitiesService', () => {
  let service: FavoriteCitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteCitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
