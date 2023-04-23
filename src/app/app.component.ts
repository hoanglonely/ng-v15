import { Component } from '@angular/core';
import { WebApiService } from './web-api.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-v15-1';

  constructor(private authService: AuthService, private webApiService: WebApiService) {
  }

  public onClick() {
    this.authService.logout();
  }

  public callApi() {
    this.webApiService.getProfile().subscribe(err => console.log(err));
  }
}
