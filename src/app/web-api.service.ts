import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  constructor(private http: HttpClient) { }

  public getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/service-api/user-management/v1.0/user`, {responseType:'json'});
  }

}
