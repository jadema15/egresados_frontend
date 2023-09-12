import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { Solicitud } from '../models/solicitud';
import { Estado } from '../models/Estado';
import { ConfirmationService, Message, MessageService, MenuItem } from 'primeng/api';
import { EmpresaServiceService } from 'src/app/services/empresa-service.service';
import { Empresa } from '../models/Empresa';
import { ProgramaServiceService } from 'src/app/services/programa-service.service';
import { Programa } from '../models/Programa';
import { HorariosServiceService } from 'src/app/services/horarios-service.service';
import { Horario } from '../models/Horario';
import { SolicitudProgramasServiceService } from 'src/app/services/solicitud-programas-service.service';
import { EgresadoServiceService } from 'src/app/services/egresado-service.service';
import { environment } from 'src/environments/environment';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {

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
  display: boolean = false;
  representatives: Solicitud[] = [];
  listaPostulados: any[] = [];
  items: MenuItem[] = [];
  visualizarPostulados: boolean = false;
  visualizarHv: boolean = false;
  esHabilitado: boolean = false;
  visualizarYesNo: boolean = false;
  variableSolicitudId: number = 0;
  variableEgresadoId: number = 0;
  cantidadPostulado: number = 33;
  empresa_id: number = 0;
  tipo_rol_id: number = 0;
  existeEmpresa: boolean = false;
  programa_id: number = 0;
  existeEgresado: boolean = false;
  egresado_id: number = 0;

  msgsModal: Message[] = [];
  formulario: FormGroup = new FormGroup({});
  objeto: any;
  esEmpresa: boolean = false;
  esEgresado: boolean = false;
  esAdministrador: boolean = false;
  pdfUrl: SafeResourceUrl | undefined;
  unsafeUrl: string = "";
  rangeDate: string = '1960:' + (new Date()).getFullYear();
  yes: string = "Sí";

  constructor(
    private solicitudService: SolicitudServiceService,
    private egresadoService: EgresadoServiceService,
    private solicitudProgramaService: SolicitudProgramasServiceService,
    private empresaService: EmpresaServiceService,
    private programaServiceService: ProgramaServiceService,
    private messageService: MessageService,
    private horariosServiceService: HorariosServiceService,
    private confirmationService: ConfirmationService,
    private primeNGConfig: PrimeNGConfig,
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
    const usuarioSesion = localStorage.getItem('user');
    let usuarioSesionString = String(usuarioSesion);
    this.objeto = JSON.parse(usuarioSesionString);
    this.esAdministrador = this.objeto.rol_id == 1 ? true : false;
    this.esEmpresa = this.objeto.rol_id == 2 ? true : false;
    this.esEgresado = this.objeto.rol_id == 3 ? true : false;
    this.egresado_id = this.objeto.id;

    this.cargarEmpresa();
    this.cargarDatosUsuario();
    this.cargarToken();
    this.cargarFormulario();
    this.cargarProgramas();
    this.cargarHorarios();
    this.cargarMenu();
    this.cargarListaEstados();
    this.cargarSolicitudInit();
    this.loadTextCalendar();
  }

  cargarMenu() {
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.showDialog(true);
          this.cargarEmpresaEnFormulario();
        }
      }
    ];
  }

  cargarListaEstados() {
    this.activos = [
      { nombre: 'Activo', value: 3 },
      { nombre: 'Inactivo', value: 4 }
    ];
  }

  cargarDatosUsuario() {
    this.empresa_id = this.objeto.id
    this.tipo_rol_id = this.objeto.rol_id;
    this.existeEmpresa = this.tipo_rol_id == 2 ? true : false;
    this.programa_id = this.tipo_rol_id == 3 ? this.objeto.programa : 0;
    this.existeEgresado = this.tipo_rol_id == 3 ? true : false;
  }

  public cargarEmpresaEnFormulario() {
    if (this.tipo_rol_id == 2) {
      let empresasFiltradas = this.empresas.filter(empresa => empresa.id === Number(this.empresa_id));
      this.solicitud.empresa_id = empresasFiltradas[0];
    }
  }

  public cargarToken() {
    this.solicitudService.getToken().subscribe(x => {
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

  seleccionarFechaString(fecha: Date) {
    const year: number = fecha.getFullYear();
    const month: number = fecha.getMonth() + 1;
    const day: number = fecha.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  public Registrar() {
    if (this.validarFormulario()) {
      this.blockedDocument = true;
      let empresa = this.formulario.controls['empresa_id'].value.id;
      let programa = this.formulario.controls['programa_id'].value.id;
      let horario = this.formulario.controls['horario_id'].value.id;
      let estado = this.formulario.controls['estado_id'].value.id;
      let fechaP = this.formulario.controls['fecha_cerrar'].value;
      const formData = {
        id: this.solicitud.id,
        empresa_id: empresa,
        programa_id: programa,
        descripcion: this.solicitud.descripcion,
        horario_id: horario,
        fecha_cerrar: this.seleccionarFechaString(fechaP),
        cantidad: this.solicitud.cantidad,
        activo: 1,
        estado_id: 3
      };
      if (this.estadoBoton) {
        this.solicitudService.postRegistroSolicitud(formData, this.token).subscribe(data => {
          this.blockedDocument = false;
          if (data.status == 'success') {
            this.addSingle(data.status, "Exito", data.mensaje);
            this.remove();
            this.cargarSolicitudInit();
            this.display = false;
          } else {
            this.addSingle(data.status, "Error", data.mensaje);
            this.remove();
          }
        });
      } else {
        this.solicitudService.putActualizarSolicitud(this.solicitud.id, formData, this.token).subscribe(data => {
          this.blockedDocument = false;
          if (data.status == 'success') {
            this.addSingle(data.status, "Exito", data.mensaje);
            this.remove();
            this.cargarSolicitudInit();
            this.display = false;
          } else {
            this.addSingle(data.status, "Error", data.mensaje);
            this.remove();
          }
        });
      }
    }
  }

  addSingle(severity: any, summary: any, detail: any) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  async cargarSolicitudInit() {
    this.blockedDocument = true;
    if (this.tipo_rol_id == 2) {
      await this.solicitudService.getSolicitudEmpresa(this.empresa_id).subscribe(datos => {
        this.representatives = datos;
        this.blockedDocument = false;
      })
    } else if (this.tipo_rol_id == 1) {
      await this.solicitudService.getListarSolicitud().subscribe(datos => {
        this.representatives = datos;
        this.blockedDocument = false;
      })
    } else {
      await this.solicitudService.getListarSolicitudPorPrograma(this.programa_id).subscribe(datos => {
        this.representatives = datos;
        this.blockedDocument = false;
      })
    }
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
    let empresasFiltradas = this.empresas.filter(empresa => empresa.id === Number(solicitud.empresa_id));
    this.solicitud.empresa_id = empresasFiltradas[0];
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

  eliminar(id: number) {
    this.solicitudService.getEliminarSolicitud(id).subscribe((data) => {
      this.cargarSolicitudInit();
      this.blockedDocument = false;
      this.addSingle('success', "Exito", 'Registro eliminado con éxito');
    })
  }

  confirm(id: number) {
    this.confirmationService.confirm({
      message: 'Realmente desea eliminar este registro?',
      accept: () => {
        this.blockedDocument = true;
        this.eliminar(id);
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
    if (this.tipo_rol_id == 2) {
      this.solicitudService.getListarSolicitudPorProgramaPorEmpresa(this.programaSolicitud.programa.id, this.empresa_id).subscribe(datos => {
        this.representatives = datos;
        this.blockedDocument = false;
      })
    } else {
      this.solicitudService.getListarSolicitudPorPrograma(this.programaSolicitud.programa.id).subscribe(datos => {
        this.representatives = datos;
        this.blockedDocument = false;
      })
    }
  }

  postular(id: number) {
    let solicitud_id = id;
    this.solicitudService.getCantidadPostulados(solicitud_id).subscribe(data => {
      if (data == 1) {
        this.confirmationService.confirm({
          message: 'Realmente desea postular a este oferta?',
          header: 'Postular',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.blockedDocument = true;
            this.RegistrarPostulado(solicitud_id);
          }
        });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Ya no se aceptan mas postulaciones' });
      }
    })
  }

  eliminarx(id: number) {
    this.confirmationService.confirm({
      message: 'Realmente desea eliminar esta oferta',
      header: 'Eliminar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      reject: () => {
      }
    });
  }

  async RegistrarPostulado(id: number) {
    let idEgresado = this.egresado_id;
    await this.solicitudProgramaService.getListarSolicitudId(id, idEgresado).subscribe(datos => {
      if (datos.length == 0) {
        const formData = {
          solicitud_id: id,
          egresado_id: idEgresado,
          estado_id: 3
        };
        this.solicitudService.postRegistroPostulado(formData, this.token).subscribe(data => {
          if (data.status == 'success') {
            this.addSingle(data.status, "Exito", data.mensaje);
            this.remove();
            this.cargarSolicitudInit();
            this.display = false;
          } else {
            this.addSingle(data.status, "Error", data.mensaje);
            this.remove();
          }
        });
        this.blockedDocument = false;
      } else {
        this.messageService.add({ severity: 'info', summary: 'Postulación', detail: 'Ya se encuentra postulado a este trabajo' });
        this.blockedDocument = false;
      }
    })
  }

  visualizar(id: number) {
    this.listaPostulados = [];
    this.visualizarPostulados = true;
    this.cargarPostulados(id);
  }

  public cargarPostulados(id: number) {
    this.solicitudProgramaService.getListarPostulados(id).subscribe(datos => {
      this.listaPostulados = datos;
    })
  }

  visualizaHv(documento: number) {
    this.unsafeUrl = environment.apiBase + 'pdfs/' + documento + '.pdf';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeUrl);
    this.visualizarHv = true;
  }

  visualizarModalYesNo(idSolicitud: number, idEgresado: number) {
    this.visualizarYesNo = true;
    this.variableSolicitudId = idSolicitud;
    this.variableEgresadoId = idEgresado;
  }

  seleccionarModalYesNo() {
    this.blockedDocument = true;
    this.visualizarYesNo = false;
    this.visualizarPostulados = false;
    this.solicitudService.getSolicitudPostulado(this.variableSolicitudId).subscribe(datos => {
      this.egresadoService.getEgresadoCambioEstadoEnvioCorreo(this.variableEgresadoId, this.variableSolicitudId).subscribe(datos2 => {
        this.messageService.add({ severity: 'success', summary: 'Postulación', detail: 'Egresado seleccionado con éxito' });
        this.blockedDocument = false;
      })
    })
  }

  cerrarModalYesNo() {
    this.visualizarYesNo = false;
  }

  consultarSolicitudPostulado(idSolicitud: number) {
    this.solicitudService.getSolicitudPostulado(idSolicitud).subscribe(datos => {
      this.representatives = datos;
    })
  }

  cerrarVentanaPostulados() {
    this.visualizarPostulados = false;
  }

  cerrar() {
    this.display = false;
  }
  
  cerrarModal() {
    this.visualizarHv = false;
  }

  loadTextCalendar() {
    this.primeNGConfig.setTranslation({
      dayNames: [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
      monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      monthNamesShort: [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
      ],
      today: "Hoy",
      clear: "Limpiar",
    });
  }
}
