import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Empresa } from '../views/egresados/models/Empresa';
@Injectable({
  providedIn: 'root'
})
export class EmpresaServiceService {

  constructor(private http: HttpClient) {
  }

  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  getListarEmpresa(): Observable<any[]> {
    let url = environment.apiUrl + "empresa";
    return this.http.get<any>(url);
  }

  postRegistroEmpresa(empresa: any, token: any) {
    //const headers = new HttpHeaders().set('X-CSRF-Token', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "empresa";
    //console.log("Desde el servico", horario)
    return this.http.post<any>(url, empresa);
  }

  postCambiarPassword(empresa: any) {
    let url = environment.apiUrl + "empresa-update-password";
    return this.http.post<any>(url, empresa);
  }

  putActualizarEmpresa(id: any, empresa: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "empresa/" + id;
    return this.http.put<any>(url, empresa);
  }

  getEliminarEmpresa(id: any): Observable<any[]> {
    let url = environment.apiUrl + "empresa/" + id;
    return this.http.delete<any>(url);
  }

  getListarTipoEmpresa(): Observable<any[]> {
    let url = environment.apiUrl + "tipo-empresa";
    return this.http.get<any>(url);
  }

  getEmpresaById(id: any): Observable<Empresa> {
    let url = environment.apiUrl + "empresa/" + id;
    return this.http.get<Empresa>(url);
  }

  getValidaCorreo(correo: string): Observable<any> {
    let url = environment.apiUrl + "empresa-valida-correo/" + correo;
    return this.http.get<any>(url);
  }

  getValidaDocumento(documento: string): Observable<any> {
    let url = environment.apiUrl + "empresa-valida-documento/" + documento;
    return this.http.get<any>(url);
  }

  getValidaCelular(celular: string): Observable<any> {
    let url = environment.apiUrl + "empresa-valida-celular/" + celular;
    return this.http.get<any>(url);
  }
}
