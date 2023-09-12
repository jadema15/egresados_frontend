import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../models/solicitud';
import { Estado } from '../models/Estado';
import { Empresa } from '../models/Empresa';
import { Programa } from '../models/Programa';
import { Horario } from '../models/Horario';
import { Message } from 'primeng/api/message';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EmpresaServiceService } from 'src/app/services/empresa-service.service';
import { HorariosServiceService } from 'src/app/services/horarios-service.service';
import { ProgramaServiceService } from 'src/app/services/programa-service.service';
import { SolicitudProgramasServiceService } from 'src/app/services/solicitud-programas-service.service';
import { SolicitudPrograma } from '../models/SolicitudPrograma';

@Component({
  selector: 'app-solicitud-programas',
  templateUrl: './solicitud-programas.component.html',
  styleUrls: ['./solicitud-programas.component.scss']
})
export class SolicitudProgramasComponent implements OnInit {

  public token: any;
  public solicitud: Solicitud = new Solicitud();
  public programaSolicitud: Solicitud = new Solicitud();
  public estado: Estado = new Estado();
  public blockedDocument: boolean = false;
  public empresas: Empresa[] = [];
  public programas: Programa[] = [];
  public solicitudPrograma: Programa[] = [];
  public horarios: Horario[] = [];
  public activos: Estado[] = [];
  display: boolean = false;
  objeto: any;
  egresado_id: number = 0;
  representatives: SolicitudPrograma[] = [];

  msgsModal: Message[] = [];

  result1: any;
  result2: any;
  result3: any;

  constructor(
    private solicitudProgramasServiceService: SolicitudProgramasServiceService,
    private empresaService: EmpresaServiceService,
    private programaServiceService: ProgramaServiceService,
    private messageService: MessageService,
    private horariosServiceService: HorariosServiceService,
    private confirmationService: ConfirmationService) {
  }


  ngOnInit(): void {

    const usuarioSesion = localStorage.getItem('user');
    let usuarioSesionString = String(usuarioSesion);
    this.objeto = JSON.parse(usuarioSesionString);
    //this.esAdministrador = this.objeto.rol_id == 1 ? true : false;
    //this.esEmpresa = this.objeto.rol_id == 2 ? true : false;
    //this.esEgresado = this.objeto.rol_id == 3 ? true : false;
    this.egresado_id = this.objeto.id;

    const promises = [this.cargarEmpresa(), this.cargarHorarios(), this.cargarSolicitudPostulado()];
    this.cargarToken();
    this.cargarProgramas();

    Promise.all(promises)
      .then((results) => {
        this.result1 = results[0];
        this.result2 = results[1];
        this.result3 = results[2];
      })
      .catch((error) => {
        console.error('Hubo un error:', error);
      });

    this.activos = [
      { nombre: 'Activo', value: 3 },
      { nombre: 'Inactivo', value: 4 }
    ];
  }

  public cargarToken() {
    this.solicitudProgramasServiceService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  addSingle(severity: any, summary: any, detail: any) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  confirmPostular(id: number) {
    this.confirmationService.confirm({
      message: '¿Realmente desea postularse?',
      accept: () => {
      }
    });
  }

  addMessages() {
    this.msgsModal = [
      { severity: 'error', summary: 'Error', detail: 'Se requieren los campos indicados como requeridos' }
    ]
  }

  removeMessages() {
    setTimeout(() => {
      this.msgsModal = [];
    }, 3000);
  }

  remove() {
    this.msgsModal = [];
  }

  async cargarEmpresa() {
    await this.empresaService.getListarEmpresa().subscribe(datos => {
      this.empresas = datos;
    })
  }

  public cargarProgramas() {
    this.programaServiceService.getListarPrograma().subscribe(datos => {
      this.solicitudPrograma = datos;
      this.programas = datos;
    })
  }

  async cargarHorarios() {
    await this.horariosServiceService.getListarHorario().subscribe(datos => {
      this.horarios = datos;
    })
  }

  datos(descripcion: string) {
    const primeros30Caracteres = descripcion.slice(0, 30);
    return primeros30Caracteres;
  }

  async cargarSolicitudPostulado() {
    this.blockedDocument = true;
    this.representatives = [];

    await this.solicitudProgramasServiceService.getCargarSolicitudPostuladoPorEgresado(this.egresado_id).subscribe(datos => {
      datos.forEach(x => {
        let empresasFiltradas = this.empresas.filter(empresa => empresa.id === Number(x.solicitud.empresa_id));
        let horariosFiltradas = this.horarios.filter(horario => horario.id === Number(x.solicitud.horario_id));
        let solicitudProgramax = new SolicitudPrograma();
        solicitudProgramax.id = x.id;
        solicitudProgramax.egresado_id = x.egresado_id;
        solicitudProgramax.solicitud = x.solicitud;
        solicitudProgramax.solicitud.empresa_id = empresasFiltradas[0];
        solicitudProgramax.solicitud.horario_id = horariosFiltradas[0];
        this.representatives.push(solicitudProgramax);
      })
      this.blockedDocument = false;
    })
  }

  eliminarSolicitudPostulado(id: number) {
    this.solicitudProgramasServiceService.deleteSolicitudPostulado(id).subscribe(datos => {
      if (datos.status == "success") {
        this.messageService.add({ severity: datos.status, summary: 'Eliminado', detail: datos.mensaje });
        this.cargarSolicitudPostulado();
      } else {
        this.messageService.add({ severity: datos.status, summary: 'Eliminado', detail: datos.mensaje });
      }
    })
  }

  eliminarx(id: number) {
    this.confirmationService.confirm({
      message: 'Realmente desea eliminar esta oferta',
      header: 'Eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.blockedDocument = true;
        this.eliminarSolicitudPostulado(id);
      },
      reject: () => {
      }
    });
  }
}
