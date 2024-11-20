import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { GeocodeResult } from '../../../../../core/interfaces/geocode.interface';
import { GeocodeService } from '../../../../../services/geocode.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @Output() onCitySelected: EventEmitter<GeocodeResult> = new EventEmitter<GeocodeResult>();

  citySearchControl = new FormControl('');
  filteredCities: Observable<GeocodeResult[]>;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly geocodeService: GeocodeService
  ) {
    this.filteredCities = this.citySearchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value: string | GeocodeResult | null) => {
        const searchTerm = typeof value === 'string' ? value : value?.name ?? '';
        return this.geocodeService.searchCities(searchTerm);
      })
    );}

  handleCitySelection(event: any) {
    const city = event.option.value;
    this.onCitySelected.emit(city);
  }

  displayFn = (city: any): string => {
    return city ? city.name : '';
  }

  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.snackBar.open(
        'Geolocation is not supported by your browser.',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.onCitySelected.emit({
          name: 'Current Location',
          latitude: latitude,
          longitude: longitude,
          admin: '',
          elevation: '',
          country: '',
          countryCode: '',
          timezone: '',
        });
      },
      (error) => {
        let message = '';
        
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            message = 'Location access was denied. Please enable location services.';
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            message = 'Location services are unavailable. Please check your device settings.';
            break;
          default:
            message = 'An error occurred while getting your location.';
        }

        this.snackBar.open(message, 'Close', { duration: 3000 });
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }
}
