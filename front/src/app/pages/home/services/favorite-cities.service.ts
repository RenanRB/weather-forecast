import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { GeocodeResult } from '../../../core/interfaces/geocode.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteCitiesService {
  private readonly FAVORITE_CITIES_KEY = environment.storageKeys.FAVORITE_CITIES_KEY;

  favoriteCities$: BehaviorSubject<GeocodeResult[]> = new BehaviorSubject<GeocodeResult[]>([]);

  private favoriteCities: GeocodeResult[] = [];

  constructor(private readonly snackBar: MatSnackBar) {
    this.loadFavoriteCities();
  }

  loadFavoriteCities(): void {
    const stored = localStorage.getItem(this.FAVORITE_CITIES_KEY);
    this.favoriteCities = stored ? JSON.parse(stored) : [];
    this.favoriteCities$.next(this.favoriteCities);
  }

  isFavorite(citySelected: GeocodeResult): boolean {
    return this.favoriteCities.some(city => 
      city.name === citySelected?.name && 
      city.admin === citySelected?.admin &&
      city.countryCode === citySelected?.countryCode
    );
  }

  toggleFavorite(city: GeocodeResult): void {
    if (!this.isFavorite(city)) {
      this.saveFavoriteCities(city);
    } else {
      this.removeFavoriteCity(city);
    }
  }

  saveFavoriteCities(city: GeocodeResult): void {
    this.favoriteCities.unshift(city);
    localStorage.setItem(this.FAVORITE_CITIES_KEY, JSON.stringify(this.favoriteCities));
    this.favoriteCities$.next(this.favoriteCities);

    this.snackBar.open(`${city.name} added to favorites`, 'Close', {
      duration: 3000
    });
  }

  removeFavoriteCity(city: GeocodeResult): void {
    this.favoriteCities = this.favoriteCities.filter(c => c.name !== city.name || c.admin !== city.admin || c.countryCode !== city.countryCode);
    localStorage.setItem(this.FAVORITE_CITIES_KEY, JSON.stringify(this.favoriteCities));
    this.favoriteCities$.next(this.favoriteCities);

    this.snackBar.open(`${city.name} removed from favorites`, 'Close', {
      duration: 3000
    });
  }
}
