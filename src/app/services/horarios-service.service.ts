import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HorariosServiceService {

  constructor(private http: HttpClient) {

  }

  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  getListarHorario(): Observable<any[]> {
    let url = environment.apiUrl + "horario";
    return this.http.get<any>(url);
  }

  postActualizarHorario(horario: any, token: any) {
    //const headers = new HttpHeaders().set('X-CSRF-Token', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "horario";
    console.log("Desde el servico", horario)
    return this.http.post<any>(url, horario);
  }

  putRegistroHorario(id: any, horario: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "horario/" + id;
    return this.http.put<any>(url, horario);
  }

  getEliminarHorario(id: any): Observable<any[]> {
    let url = environment.apiUrl + "horario/" + id;
    return this.http.delete<any>(url);
  }

}
