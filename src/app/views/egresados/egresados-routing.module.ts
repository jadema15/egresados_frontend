import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { ProgramaComponent } from './programa/programa.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { SolicitudProgramasComponent } from './solicitud-programas/solicitud-programas.component';
import { EgresadoComponent } from './egresado/egresado.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { EmpresaConfiguracionComponent } from './empresa-configuracion/empresa-configuracion.component';
import { EgresadoConfiguracionComponent } from './egresado-configuracion/egresado-configuracion.component';
import { AdminConfiguracionComponent } from './admin-configuracion/admin-configuracion.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Buttons'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'egresados'
      },

      {
        path: 'administrador',
        component: AdminConfiguracionComponent,
        data: {
          title: 'Administrativos'
        }
      },
      {
        path: 'egresado',
        component: EgresadoComponent,
        data: {
          title: 'Egresado'
        }
      },
      {
        path: 'registro',
        component: RegistroComponent,
        data: {
          title: 'Registro'
        }
      },
      {
        path: 'programa',
        component: ProgramaComponent,
        data: {
          title: 'Programa'
        }
      },
      {
        path: 'empresa',
        component: EmpresasComponent,
        data: {
          title: 'Empresa'
        }
      },
      {
        path: 'empresa-configuracion',
        component: EmpresaConfiguracionComponent,
        data: {
          title: 'Empresa'
        }
      },
      {
        path: 'egresado-configuracion',
        component: EgresadoConfiguracionComponent,
        data: {
          title: 'Empresa'
        }
      },
      {
        path: 'solicitud',
        component: SolicitudComponent,
        data: {
          title: 'Solicitud'
        }
      },
      {
        path: 'solicitud-programas',
        component: SolicitudProgramasComponent,
        data: {
          title: 'Solicitud Egresado'
        }
      },
      {
        path: 'configuracion',
        component: ConfiguracionComponent,
        data: {
          title: 'Configuración'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule { }
