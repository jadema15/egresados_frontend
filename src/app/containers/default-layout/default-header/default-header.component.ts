import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  public prueba: string | undefined;
  public username: string = "";
  public esAdministrativo: boolean = false;
  public esEmpresa: boolean = false;
  public esEgresado: boolean = false;

  constructor(private classToggler: ClassToggleService) {
    super();
    const usuarioSesion = localStorage.getItem('user');
    let usuarioSesionString = String(usuarioSesion);
    const objeto = JSON.parse(usuarioSesionString);
    this.username = objeto.nombre + " " + objeto.apellido;
    this.esAdministrativo = objeto.rol_id == 1 ? true : false;
    this.esEmpresa = objeto.rol_id == 2 ? true : false;
    this.esEgresado = objeto.rol_id == 3 ? true : false;
  }

  cerrarSesion() {
    localStorage.removeItem("user");
    localStorage.removeItem("valida");
  }


}
