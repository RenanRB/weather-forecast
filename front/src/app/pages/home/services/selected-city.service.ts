import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeocodeResult } from '../../../core/interfaces/geocode.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelectedCityService {
  private readonly STORED_CITY_KEY = environment.storageKeys.STORED_CITY_KEY;

  selectedCity$: BehaviorSubject<GeocodeResult | null> = new BehaviorSubject<GeocodeResult | null>(null);

  private readonly selectedCity: GeocodeResult | null = null;

  constructor() {
    this.selectedCity = this.getStoredCity();
    this.selectedCity$.next(this.selectedCity);
  }

  saveCity(city: GeocodeResult): void {
    localStorage.setItem(this.STORED_CITY_KEY, JSON.stringify(city));
  }

  private getStoredCity(): GeocodeResult | null {
    const storedCity = localStorage.getItem(this.STORED_CITY_KEY);
    return storedCity ? JSON.parse(storedCity) : null;
  }
}
