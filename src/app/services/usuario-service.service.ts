import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

  usuariorespueta: any;
  username: any;
  password: any;

  constructor(private http: HttpClient, private router: Router) { }

  getToken(): Observable<any[]> {
    let url = environment.apiBase + "token";
    return this.http.get<any>(url);
  }

  postValidarUsuario(username: string, password: string, tipo: string): Observable<any> {
    let url = environment.apiUrl + "usuario/valida-usuario";
    const data = {
      documento: username,
      password: password,
      tipo_usuario: tipo,
    };
    return this.http.post(url, data);
  }

  getAuthToken(): Observable<boolean> {
    let salida = localStorage.getItem("valida");
    if (salida == "ok") {
      return of(true);
    } else {
      return of(false);
    }
  }

  getUsuarioById(id: number): Observable<any> {
    let url = environment.apiUrl + "usuario/usuario/" + id;
    return this.http.get<any>(url);
  }

  putActualizarUsuario(id: any, usuarios: any, token: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token
    });
    let url = environment.apiUrl + "usuario/" + id;
    return this.http.put<any>(url, usuarios);
  }

  postRegistrarUsuario(usuarios: any) {
    let url = environment.apiUrl + "usuario";
    return this.http.post<any>(url, usuarios);
  }

  getListaUsuarios(): Observable<any> {
    let url = environment.apiUrl + "lista-usuarios";
    return this.http.get<any>(url);
  }

  getValidaCorreo(correo: string): Observable<any> {
    let url = environment.apiUrl + "usuario-valida-correo/" + correo;
    return this.http.get<any>(url);
  }

  getValidaDocumento(documento: string): Observable<any> {
    let url = environment.apiUrl + "usuario-valida-documento/" + documento;
    return this.http.get<any>(url);
  }

  getValidaCelular(celular: string): Observable<any> {
    let url = environment.apiUrl + "usuario-valida-celular/" + celular;
    return this.http.get<any>(url);
  }

  postCambiarPassword(egresado: any) {
    let url = environment.apiUrl + "usuario-update-password";
    return this.http.post<any>(url, egresado);
  }

  postRestablecerPassword(egresado: any) {
    let url = environment.apiUrl + "solicitud-enviar-correo";
    return this.http.post<any>(url, egresado);
  }
}


