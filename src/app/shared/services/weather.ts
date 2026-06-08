import {inject, Injectable} from '@angular/core';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {WeatherData} from "../models/weather.models";
import {map, Observable, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  private readonly http = inject(HttpClient)

  getWeatherForEvent(location: string, date: string): Observable<WeatherData> {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    //geocodage du lieu (switchmap pour 2 appels car ensuite appel à la meteo)
    return this.http.get<any[]>(geocodeUrl).pipe(
     switchMap(result => {
       console.log('Nominatim résultat:', result); // 👈
       console.log('Lieu trouvé:', result[0]?.display_name); //
       const lat = parseFloat(result[0].lat);
       const lon = parseFloat(result[0].lon);
       const dateOnly = date.split('T')[0];

       const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max&timezone=Europe/Brussels&start_date=${dateOnly}&end_date=${dateOnly}`;

       return this.http.get<any>(weatherUrl)
     }),
     map(weather => {
       const code = weather.daily.weathercode[0];
       const temp = weather.daily.temperature_2m_max[0];
       return {
         temperature: Math.round(temp),
         weatherCode: code,
         weatherDescription: this.getDescription(code),
         weatherIcon: this.getIcon(code),
       };
     })
    );
  }

  private getDescription(code: number): string {
    if (code === 0) return 'Ensoleillé';
    if (code <= 3) return 'Nuageux';
    if (code <= 49) return 'Brouillard';
    if (code <= 59) return 'Bruine';
    if (code <= 69) return 'Pluie';
    if (code <= 79) return 'Neige';
    if (code <= 82) return 'Averses';
    if (code <= 99) return 'Orage';
    return 'Inconnu';
  }

  private getIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 49) return '🌫️';
    if (code <= 59) return '🌦️';
    if (code <= 69) return '🌧️';
    if (code <= 79) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 99) return '⛈️';
    return '🌡️';
  }
}

