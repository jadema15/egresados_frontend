import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadoCivilServiceService {

  constructor(private http: HttpClient) { }

  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  getListarEstadoCivil(): Observable<any[]> {
    let url = environment.apiUrl + "estado-civil";
    return this.http.get<any>(url);
  }
}
