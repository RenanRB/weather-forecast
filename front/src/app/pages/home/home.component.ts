import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private readonly weatherService: WeatherService) {

  }

  ngOnInit(): void {
    // this.weatherService.getWeather().subscribe((data) => {
    //   console.log(data);
    // });
  }

}
