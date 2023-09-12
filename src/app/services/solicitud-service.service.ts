import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudServiceService {

  constructor(private http: HttpClient) { }


  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  getListarSolicitud(): Observable<any[]> {
    let url = environment.apiUrl + "solicitud";
    console.log(url);
    return this.http.get<any>(url);
  }

  getListarSolicitudId(id: number): Observable<any[]> {
    let url = environment.apiUrl + "solicitud/" + id;
    return this.http.get<any>(url);
  }
  
  getListarSolicitudIdPrograma(): Observable<any[]> {
    let url = environment.apiUrl + "solicitud";
    console.log(url);
    return this.http.get<any>(url);
  }

  postRegistroSolicitud(solicitud: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "solicitud";
    return this.http.post<any>(url, solicitud);
  }

  putActualizarSolicitud(id: any, solicitud: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });    
    let url = environment.apiUrl + "solicitud/" + id;
    console.log(url);
    return this.http.put<any>(url, solicitud);
  }

  getEliminarSolicitud(id: any): Observable<any[]> {
    let url = environment.apiUrl + "solicitud/" + id;
    return this.http.delete<any>(url);
  }

  getListarSolicitudPorPrograma(id: any): Observable<any[]> {
    let url = environment.apiUrl + "solicitud-programa/" + id;
    return this.http.get<any>(url);
  }

  getListarSolicitudPorProgramaPorEmpresa(idPrograma: any, idEmpresa: any): Observable<any[]> {
    let url = environment.apiUrl + "solicitud-programa-empresa/" + idPrograma + "/" + idEmpresa;
    return this.http.get<any>(url);
  }

  getCantidadPostulados(id: any): Observable<Number> {
    let url = environment.apiUrl + "solicitud-programa-consulta-cantidad/" + id;
    return this.http.get<any>(url);
  }

  postRegistroPostulado(solicitudPrograma: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "solicitud-programas";
    return this.http.post<any>(url, solicitudPrograma);
  }

  getSolicitudPostulado(id: Number): Observable<any[]> {
    let url = environment.apiUrl + "solicitud-postulado/" + id;
    return this.http.get<any>(url);
  }

  getSolicitudEmpresa(idEmpresa: Number): Observable<any[]> {
    let url = environment.apiUrl + "solicitud-empresa/" + idEmpresa;
    return this.http.get<any>(url);
  }

}
