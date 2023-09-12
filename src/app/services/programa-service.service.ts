import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramaServiceService {

  constructor(private http: HttpClient) { }

  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  getListarPrograma(): Observable<any[]> {
    let url = environment.apiUrl + "programa";
    return this.http.get<any>(url);
  }

  postActualizarPrograma(horario: any, token: any) {
    //const headers = new HttpHeaders().set('X-CSRF-Token', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "programa";
    console.log("Desde el servico", horario)
    return this.http.post<any>(url, horario);
  }

  putRegistroPrograma(id: any, horario: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "programa/" + id;
    return this.http.put<any>(url, horario);
  }

  getEliminarPrograma(id: any): Observable<any[]> {
    let url = environment.apiUrl + "programa/" + id;
    return this.http.delete<any>(url);
  }
}
