import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { GeocodeResult } from '../../../../../core/interfaces/geocode.interface';
import { GeocodeService } from '../../../../../services/geocode.service';

@Component({
  selector: 'app-shearch-bar',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './shearch-bar.component.html',
  styleUrl: './shearch-bar.component.scss'
})
export class ShearchBarComponent {
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
    if (navigator.geolocation) {
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
          let errorMessage = 'Unable to retrieve your location. Using default location.';
          switch(error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable location services.';
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Check your device settings.';
              break;
            case GeolocationPositionError.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      this.snackBar.open('Geolocation is not supported by this browser', 'Close', {
        duration: 5000
      });
    }
  }
}
