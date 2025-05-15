// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, HttpClientModule, CommonModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css',
// })
// export class AppComponent {
//   title = 'time';

//   time: any;
//   date:any;
//   constructor(public http: HttpClient) {}

//   changeTime(event: any) {
//     const timeValue = event.target.value;

//     this.http
//       .get(`https://localhost:7179/Time/GetDateTime?timeZoneId=${timeValue}`)
//       .subscribe((res: any) => {
//         this.time = res.time;
//         this.date = res.country;
//         console.log(this.time);
//       });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title='time';
  timezones: string[] = [];
  selectedTime: { timeZone: string; dateTime: string } | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch the list of timezones from the backend
    this.http.get<string[]>('http://datetimebackend.runasp.net/Time/GetTimeZones').subscribe({
      next: (data) => {
        this.timezones = data;
      },
      error: (err) => {
        console.error("Failed to fetch timezones", err);
      } 
    });
  }

  onTimezoneChange(event: Event) {
    const selectedZone = (event.target as HTMLSelectElement).value;

    if (!selectedZone) {
      this.selectedTime = null;
      return;
    }

    const apiUrl = `http://datetimebackend.runasp.net/Time/GetDateTime?timeZoneId=${encodeURIComponent(selectedZone)}`;

    this.http.get<{ timeZone: string; dateTime: string }>(apiUrl).subscribe({
      next: (data) => {
        this.selectedTime = data;
      },
      error: (err) => {
        console.error(`Failed to fetch time for ${selectedZone}`, err);
        this.selectedTime = null;
      }
    });
  }
}
