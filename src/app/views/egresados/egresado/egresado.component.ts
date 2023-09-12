import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EgresadoServiceService } from 'src/app/services/egresado-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Solicitud } from '../models/solicitud';
import { Estado } from '../models/Estado';
import { ConfirmationService, Message, MessageService, MenuItem } from 'primeng/api';
import { EmpresaServiceService } from 'src/app/services/empresa-service.service';
import { Empresa } from '../models/Empresa';
import { ProgramaServiceService } from 'src/app/services/programa-service.service';
import { Programa } from '../models/Programa';
import { HorariosServiceService } from 'src/app/services/horarios-service.service';
import { environment } from 'src/environments/environment';
import { Horario } from '../models/Horario';

@Component({
  selector: 'app-egresado',
  templateUrl: './egresado.component.html',
  styleUrls: ['./egresado.component.scss']
})
export class EgresadoComponent implements OnInit {

  condicion: boolean = true;
  public token: any;
  public solicitud: Solicitud = new Solicitud();
  public programaSolicitud: Solicitud = new Solicitud();
  public estado: Estado = new Estado();
  public blockedDocument: boolean = false;
  public contador: number = 1;
  public contadorActualizado: number = 0;
  public accion: string = "";
  public boton: string = "";
  public estadoBoton: boolean = true;
  public dialogHeight = '80vh';
  public empresas: Empresa[] = [];
  public programas: Programa[] = [];
  public solicitudPrograma: Programa[] = [];
  public horarios: Horario[] = [];
  public activos: Estado[] = [];
  public fechaCerrar: Date | undefined;
  pdfUrl: SafeResourceUrl | undefined;
  unsafeUrl: string = "";
  visualizarHv: boolean = false;
  display: boolean = false;
  representatives: any[] = [];
  items: MenuItem[] = [];

  msgsModal: Message[] = [];
  formulario: FormGroup = new FormGroup({});

  constructor(
    private egresadoServiceService: EgresadoServiceService,
    private empresaService: EmpresaServiceService,
    private programaServiceService: ProgramaServiceService,
    private messageService: MessageService,
    private horariosServiceService: HorariosServiceService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer) {
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      empresa_id: new FormControl('', Validators.required),
      programa_id: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      horario_id: new FormControl('',),
      cantidad: new FormControl('', Validators.required),
      fecha_cerrar: new FormControl('',),
      activo: new FormControl('', Validators.required),
      estado_id: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.cargarToken();
    this.cargarFormulario();
    this.cargarEmpresa();
    this.cargarProgramas();
    this.cargarHorarios();
    this.cargarEgresados();
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.showDialog(true);
        }
      }
    ];

    this.activos = [
      { nombre: 'Activo', value: 3 },
      { nombre: 'Inactivo', value: 4 }
    ];
  }

  public cargarToken() {
    this.egresadoServiceService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  seleccionarFecha() {
    if (this.solicitud.fecha_cerrar) {
      this.fechaCerrar = this.solicitud.fecha_cerrar;
    }
  }

  addSingle(severity: any, summary: any, detail: any) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  public cargarEgresados() {
    this.egresadoServiceService.getListarEgresados().subscribe(datos => {
      this.representatives = datos;
    })
  }

  showDialog(estado: boolean) {
    estado ? this.accion = "Registrar" : this.accion = "Editar";
    estado ? this.boton = "Guardar" : this.boton = "Actualizar";
    if (estado) {
      this.formulario.reset();
      this.formulario.controls['cantidad'].setValue(5);
    }
    this.estadoBoton = estado;
    this.display = true;
  }

  editar(solicitud: Solicitud) {
    this.showDialog(false);
    this.solicitud.id = solicitud.id;
    this.solicitud.empresa_id = solicitud.empresa_id;
    this.solicitud.programa = solicitud.programa;
    this.solicitud.descripcion = solicitud.descripcion;
    this.solicitud.horario_id = solicitud.horario_id;
    if (solicitud.fecha_cerrar !== undefined) {
      const fechaDate = new Date(solicitud.fecha_cerrar);
      this.solicitud.fecha_cerrar = fechaDate;
    }
    this.solicitud.cantidad = solicitud.cantidad;
    this.solicitud.activo = solicitud.activo;
    this.solicitud.estado_id = solicitud.estado_id;
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

  public cargarEmpresa() {
    this.empresaService.getListarEmpresa().subscribe(datos => {
      this.empresas = datos;
    })
  }

  public cargarProgramas() {
    this.programaServiceService.getListarPrograma().subscribe(datos => {
      this.solicitudPrograma = datos;
      this.programas = datos;
    })
  }

  public cargarHorarios() {
    this.horariosServiceService.getListarHorario().subscribe(datos => {
      this.horarios = datos;
    })
  }

  validarFormulario(): boolean {
    if (this.formulario.controls['descripcion'].value == null || this.solicitud.descripcion?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['fecha_cerrar'].value == null) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    return true;
  }

  datos(descripcion: string) {
    const primeros30Caracteres = descripcion.slice(0, 30);
    return primeros30Caracteres;
  }

  cargarSolicitudPrograma() {
    this.blockedDocument = true;
    this.egresadoServiceService.getListarEgresadosPorPrograma(this.programaSolicitud.programa.id).subscribe(datos => {
      this.representatives = datos;
      this.blockedDocument = false;
    })
  }

  eliminarx(id: number) {
    this.confirmationService.confirm({
      message: 'Realmente desea eliminar esta oferta',
      header: 'Eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Eliminar', detail: 'Registro eliminado con éxito' });
      },
      reject: () => {
      }
    });
  }

  consultarSolicitudPostulado(id: number) {
    this.egresadoServiceService.getEgresadoCambioEstado(id).subscribe(datos => {
    })
  }

  visualizaHv(documento: number) {
    this.unsafeUrl = environment.apiBase + 'pdfs/' + documento + '.pdf';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeUrl);
    this.visualizarHv = true;
  }

  cerrarModal() {
    this.visualizarHv = false;
  }

}

