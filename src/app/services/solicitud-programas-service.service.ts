import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseProgramas } from '../../app/views/egresados/models/ResponseProgramas';
import { SolicitudPrograma } from '../views/egresados/models/SolicitudPrograma';

@Injectable({
  providedIn: 'root'
})
export class SolicitudProgramasServiceService {

  constructor(private http: HttpClient) { }

  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  getCargarSolicitudPostulado(): Observable<SolicitudPrograma[]> {
    let url = environment.apiUrl + "solicitud-programas";
    return this.http.get<any>(url);
  }

  getListarSolicitudId(idEgresado: number, idSolicitud: number): Observable<SolicitudPrograma[]> {
    let url = environment.apiUrl + "solicitud-programa-consulta/" + idEgresado + "/" + idSolicitud;
    return this.http.get<any>(url);
  }

  deleteSolicitudPostulado(id: any): Observable<ResponseProgramas> {
    let url = environment.apiUrl + "solicitud-programas/" + id;
    return this.http.delete<any>(url);
  }

  getListarPostulados(id: any): Observable<SolicitudPrograma[]> {
    let url = environment.apiUrl + "solicitud-programa-consulta-postulados/" + id;
    return this.http.get<any>(url);
  }

  getCargarSolicitudPostuladoPorEgresado(idEgresado: number): Observable<SolicitudPrograma[]> {
    let url = environment.apiUrl + "solicitud-postulado-egresado/" + idEgresado;
    return this.http.get<any>(url);
  }
}
