import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EgresadoServiceService {

  constructor(private http: HttpClient) {
  }

  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  getListarEgresados(): Observable<any[]> {
    let url = environment.apiUrl + "egresado";
    return this.http.get<any>(url);
  }

  getListarEgresadosPorPrograma(id: number): Observable<any[]> {
    let url = environment.apiUrl + "egresado-programa/" + id;
    return this.http.get<any>(url);
  }

  getValidaCorreo(correo: string): Observable<any> {
    let url = environment.apiUrl + "egresado-valida-correo/" + correo;
    return this.http.get<any>(url);
  }

  getValidaDocumento(documento: string): Observable<any> {
    let url = environment.apiUrl + "egresado-valida-documento/" + documento;
    return this.http.get<any>(url);
  }

  getValidaCelular(celular: string): Observable<any> {
    let url = environment.apiUrl + "egresado-valida-celular/" + celular;
    return this.http.get<any>(url);
  }

  getEgresadoCambioEstado(id: number): Observable<any[]> {
    let url = environment.apiUrl + "egresado-programa-cambio-estado/" + id;
    return this.http.get<any>(url);
  }

  getEgresadoCambioEstadoEnvioCorreo(id: number, idSolicitud: number): Observable<any[]> {
    let url = environment.apiUrl + "egresado-programa-cambio-estado-envio-correo/" + id + "/" + idSolicitud;
    return this.http.get<any>(url);
  }

  getEgresadoById(id: number): Observable<any> {
    let url = environment.apiUrl + "egresado-programa-cambio-estado/" + id;
    return this.http.get<any>(url);
  }

  postRegistroEgresado(egresado: any, token: any) {
    let url = environment.apiUrl + "egresado";
    return this.http.post<any>(url, egresado);
  }

  putActualizarEgresado(id: number, egresado: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "egresado/" + id;
    return this.http.put<any>(url, egresado);
  }

  ////////////////////////////////
  getListarEstadoCivil(): Observable<any[]> {
    let url = environment.apiUrl + "estado-civil";
    return this.http.get<any>(url);
  }

  subirArchivoPdf(formData: any) {
    let url = environment.apiUrl + "upload-pdf";
    return this.http.post<any>(url, formData);
  }

  postCambiarPassword(egresado: any) {
    let url = environment.apiUrl + "egresado-update-password";
    return this.http.post<any>(url, egresado);
  }
}
