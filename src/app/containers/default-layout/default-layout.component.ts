import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
//import { navItems } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})


export class DefaultLayoutComponent {
  rol_id: string = '';
  public navItemsprueba: INavData[] | undefined;

  constructor() {
    this.cargarDatosUsuario()
    if (this.rol_id == '1') {
      this.cargarMenulateralAdmin();
    } else if (this.rol_id == '2') {
      this.cargarMenulateralEmpresa();
    } else {
      this.cargarMenulateralEgresado();
    }
  }

  cargarMenulateralAdmin() {
    this.navItemsprueba = [
      {
        title: true,
        name: 'Configuración'
      },
      {
        name: 'Administrativos',
        url: '/egresados/administrador',
        iconComponent: { name: 'cil-lock-locked' }
      },
      {
        name: 'Egresados',
        url: '/egresados/egresado',
        iconComponent: { name: 'cil-user' }
      },
      {
        name: 'Horarios',
        url: '/egresados/registro',
        iconComponent: { name: 'cil-calculator' }
      },
      {
        name: 'Programas',
        url: '/egresados/programa',
        iconComponent: { name: 'cil-star' }
      },
      {
        name: 'Empresas',
        url: '/egresados/empresa',
        iconComponent: { name: 'cil-puzzle' }
      },
      {
        name: 'Bolsa de Empleo',
        url: '/egresados',
        iconComponent: { name: 'cil-cursor' },
        children: [
          {
            name: 'Solicitudes',
            url: '/egresados/solicitud'
          }
        ]
      }
    ];
  }
  cargarMenulateralEmpresa() {
    this.navItemsprueba = [
      {
        name: 'Bolsa de Empleo',
        url: '/egresados',
        iconComponent: { name: 'cil-cursor' },
        children: [
          {
            name: 'Solicitudes',
            url: '/egresados/solicitud'
          }
        ]
      }
    ];
  }
  cargarMenulateralEgresado() {
    this.navItemsprueba = [
      {
        name: 'Bolsa de Empleo',
        url: '/egresados',
        iconComponent: { name: 'cil-cursor' },
        children: [
          {
            name: 'Solicitudes',
            url: '/egresados/solicitud'
          },
          {
            name: 'Mis Postulaciones',
            url: '/egresados/solicitud-programas'
          }
        ]
      }
    ];
  }
  cargarDatosUsuario() {
    const usuarioSesion = localStorage.getItem('user');
    let usuarioSesionString = String(usuarioSesion);
    const objeto = JSON.parse(usuarioSesionString);
    this.rol_id = objeto.rol_id
  }
}
