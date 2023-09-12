import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { Message, MessageService } from 'primeng/api';
import { EstadoCivilServiceService } from 'src/app/services/estado-civil-service.service';
import { Usuarios } from '../models/Usuarios';
import { Egresado } from '../models/Egresado';
import { CambioPassword } from '../models/CambioPassword';
import { EgresadoServiceService } from 'src/app/services/egresado-service.service';
import { ProgramaServiceService } from 'src/app/services/programa-service.service';
import { Programa } from '../models/Programa';
import { EstadoCivil } from '../models/EstadoCivil';
import { environment } from 'src/environments/environment';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-egresado-configuracion',
  templateUrl: './egresado-configuracion.component.html',
  styleUrls: ['./egresado-configuracion.component.scss']
})
export class EgresadoConfiguracionComponent implements OnInit {
  public token: any;
  public blockedDocument: boolean = false;
  public dialogHeight = '80vh';
  public fechaCerrar: Date | undefined;
  public usuarios: Usuarios = new Usuarios();
  public egresado: Egresado = new Egresado();
  public programa: Programa = new Programa();
  public cambioPassword: CambioPassword = new CambioPassword();
  public programas: Programa[] = [];
  public estadoscivil: EstadoCivil[] = [];
  display: boolean = false;
  empresa_id: number = 0;
  tipo_rol_id: number = 0;
  existeEmpresa: boolean = false;
  programa_id: number = 0;
  existeEgresado: boolean = false;
  msgsModal: Message[] = [];
  msgsModalCambiarPassword: Message[] = [];
  formulario: FormGroup = new FormGroup({});
  formularioCambioPassword: FormGroup = new FormGroup({});
  objeto: any;
  sexos: any[] = [];
  fechaString: string = "";
  selectedFile: File | any;
  pdfUrl: SafeResourceUrl | undefined;
  unsafeUrl: string = "";
  visualizarHv: boolean = false;
  visualizarUpdatePassword: boolean = false;
  permiteCambiarPassword: boolean = false;

  constructor(
    private solicitudService: SolicitudServiceService,
    private messageService: MessageService,
    private egresadoServiceService: EgresadoServiceService,
    private programaServiceService: ProgramaServiceService,
    private estadoCivilServiceService: EstadoCivilServiceService,
    private usuarioServiceService: UsuarioServiceService,
    private sanitizer: DomSanitizer
  ) {
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      estadocivil_id: new FormControl('', Validators.required),
      fecha_nac: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      nombre2: new FormControl('',),
      apellido: new FormControl('', Validators.required),
      apellido2: new FormControl('',),
      sexo: new FormControl('', Validators.required),
      documento: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      programa_id: new FormControl('',),
      celular: new FormControl('', Validators.required),
      hoja_vida: new FormControl(''),
      activo: new FormControl(''),
      estado: new FormControl(''),
      password: new FormControl('', Validators.required),
      password_re: new FormControl('', Validators.required),
      observacion: new FormControl(''),
    });
  }

  cargarFormularioCambioPassword(): void {
    this.formularioCambioPassword = new FormGroup({
      password_old: new FormControl('', Validators.required),
      password_new: new FormControl('', Validators.required),
      password_re: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const usuarioSesion = localStorage.getItem('user');
    let usuarioSesionString = String(usuarioSesion);
    this.objeto = JSON.parse(usuarioSesionString);

    this.sexos.push({
      id: 1,
      nombre_sexo: "Masculino",
    }, {
      id: 2,
      nombre_sexo: "Femenino",
    }, {
      id: 3,
      nombre_sexo: "Otro"
    })

    this.cargarFormulario();
    this.cargarFormularioCambioPassword();
    this.cargarPrograma();
    this.cargarEstadoCivil();
    this.cargarEgresado(this.objeto.id);
    this.cargarDatosUsuario();
    this.cargarToken();
  }

  async cargarEstadoCivil() {
    await this.estadoCivilServiceService.getListarEstadoCivil().subscribe(datos => {
      this.estadoscivil = datos;
    });
  }
  async cargarPrograma() {
    await this.programaServiceService.getListarPrograma().subscribe(datos => {
      this.programas = datos;
    })
  }

  cargarDatosUsuario() {
    this.empresa_id = this.objeto.id
    this.tipo_rol_id = this.objeto.rol_id;
    this.existeEmpresa = this.tipo_rol_id == 2 ? true : false;
    this.programa_id = this.tipo_rol_id == 3 ? this.objeto.programa : 0;
    this.existeEgresado = this.tipo_rol_id == 3 ? true : false;
  }

  public cargarToken() {
    this.solicitudService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  addSingle(severity: any, summary: any, detail: any) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  addMessages() {
    this.msgsModal = [
      { severity: 'error', summary: 'Error', detail: 'Se requieren los campos indicados como requeridos' }
    ]
  }

  addMessagesCambiarPassword() {
    this.msgsModalCambiarPassword = [
      { severity: 'error', summary: 'Error', detail: 'Se requieren los campos indicados como requeridos' }
    ]
  }

  addMessagesValidaPassword() {
    let mensaje = "La contraseña ingresada es incorrecta"
    this.msgsModalCambiarPassword = [
      { severity: 'error', summary: 'Error', detail: mensaje }
    ]
  }

  addMessagesValidaPasswordAndPassword() {
    let mensaje = "Las contraseñas ingresadas no coinciden"
    this.msgsModalCambiarPassword = [
      { severity: 'error', summary: 'Error', detail: mensaje }
    ]
  }

  removeMessages() {
    setTimeout(() => {
      this.msgsModal = [];
      this.msgsModalCambiarPassword = [];
    }, 3000);
  }

  remove() {
    this.msgsModal = [];
  }

  validarFormulario(): boolean {
    if (this.formulario.controls['nombre'].value == null || this.formulario.controls['nombre'].value.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['apellido'].value == null || this.formulario.controls['apellido'].value.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['documento'].value == null || this.formulario.controls['documento'].value.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['celular'].value == null || this.formulario.controls['celular'].value.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['correo'].value == null || this.formulario.controls['correo'].value.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    return true;
  }

  seleccionarFecha() {
    this.fechaCerrar = this.formulario.controls['fecha_nac'].value;
    if (this.fechaCerrar) {
      const year: number = this.fechaCerrar.getFullYear();
      const month: number = this.fechaCerrar.getMonth() + 1;
      const day: number = this.fechaCerrar.getDate();
      this.fechaString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }
  }

  async cargarEgresado(id: number) {
    this.blockedDocument = true;
    await this.egresadoServiceService.getEgresadoById(id).subscribe(datos => {
      this.egresado.id = datos.id;
      this.egresado.nombre = datos.nombre;
      this.egresado.nombre2 = datos.nombre2;
      this.egresado.apellido = datos.apellido;
      this.egresado.apellido2 = datos.apellido2;
      this.egresado.documento = datos.documento;
      this.egresado.fecha_nac = datos.fecha_nac;
      const dateObject = new Date(datos.fecha_nac);
      this.egresado.fecha_nac = dateObject;
      let programaFiltrado = this.programas.filter(pro => pro.id == Number(datos.programa_id));
      this.egresado.programa_id = programaFiltrado[0];
      let estadoFiltrado = this.estadoscivil.filter(est => est.id == Number(datos.estadocivil_id));
      this.egresado.estadocivil_id = estadoFiltrado[0];
      this.egresado.estado_id = datos.estado_id;
      let sexoFiltrado = this.sexos.filter(sex => sex.id == Number(datos.sexo));
      this.egresado.sexo = sexoFiltrado[0];
      this.egresado.celular = datos.celular;
      this.egresado.correo = datos.correo;
      this.egresado.observacion = datos.observacion;
      this.egresado.hoja_vida = datos.hoja_vida;
      this.egresado.foto = datos.foto;

      this.blockedDocument = false;
    });
  }

  actualizarEgresado() {
    this.blockedDocument = true;
    if (this.validarFormulario()) {
      const formData = {
        id: String(this.egresado.id),
        nombre: this.formulario.controls['nombre'].value,
        nombre2: this.formulario.controls['nombre2'].value,
        apellido: this.formulario.controls['apellido'].value,
        apellido2: this.formulario.controls['apellido2'].value,
        programa_id: this.formulario.controls['programa_id'].value.id,
        documento: this.egresado.documento,
        correo: this.formulario.controls['correo'].value,
        sexo: this.formulario.controls['sexo'].value.id,
        fecha_nac: String(this.seleccionarFechaString(this.egresado.fecha_nac)),
        celular: this.formulario.controls['celular'].value,
        estadocivil_id: this.formulario.controls['estadocivil_id'].value.id,
        estado_id: String(this.egresado.estado_id),
        hoja_vida: String(this.egresado.hoja_vida),
        observacion: this.formulario.controls['observacion'].value,
        foto: String(this.egresado.foto)
      };

      this.egresadoServiceService.putActualizarEgresado(this.egresado.id, formData, null).subscribe(data => {

        if (data.status == 'success') {
          this.blockedDocument = false;
          this.addSingle(data.status, "Exito", data.mensaje);
          this.remove();
          this.display = false;
        } else {
          this.blockedDocument = false;
          this.addSingle(data.status, "Error", data.mensaje);
          this.remove();
        }
      });
    }
  }

  seleccionarFechaString(fecha: Date) {
    const year: number = fecha.getFullYear();
    const month: number = fecha.getMonth() + 1;
    const day: number = fecha.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }


  enviarHojaVidaPdf(data: any) {
    this.egresadoServiceService.subirArchivoPdf(data).subscribe(respueta => {
      if (respueta.status == "success") {
        this.addSingle(respueta.status, "Exito", respueta.mensaje);
        this.remove();
        this.cargarEgresado(this.objeto.id);
      } else {
        this.addSingle(respueta.status, "Error", respueta.mensaje);
        this.remove();
      }
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('id', String(this.egresado.id));
    formData.append('documento', String(this.egresado.documento));
    formData.append('pdf', this.selectedFile);
    this.enviarHojaVidaPdf(formData);
  }

  lanzarModal() {
    this.unsafeUrl = environment.apiBase + 'pdfs/' + this.egresado.documento + '.pdf';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.unsafeUrl);
    this.visualizarHv = true;
  }

  cerrarModal() {
    this.visualizarHv = false;
  }

  modalActualizarPassword() {
    this.formularioCambioPassword.reset();
    this.visualizarUpdatePassword = true;
  }

  cerrarModalActualizarPassword() {
    this.visualizarUpdatePassword = false;
    this.permiteCambiarPassword = false;
  }

  CambiarPassword() {
    if (this.validarFormularioCambiarPassword()) {
      this.blockedDocument = true;
      const formData = {
        id: String(this.egresado.id),
        password: CryptoJS.MD5(this.formularioCambioPassword.controls['password_new'].value).toString(),
      };
      this.egresadoServiceService.postCambiarPassword(formData).subscribe(data => {
        this.blockedDocument = false;
        if (data.status == 'success') {
          this.addSingle(data.status, "Exito", data.mensaje);
          this.remove();
          this.removeMessages();
          this.visualizarUpdatePassword = false;
          this.formularioCambioPassword.reset();
          this.permiteCambiarPassword = false;
        } else {
          this.addSingle(data.status, "Error", data.mensaje);
          this.remove();
          this.removeMessages();
          this.visualizarUpdatePassword = false;
          this.formularioCambioPassword.reset();
        }
      });
    }
  }


  validarPassword() {
    this.blockedDocument = true;
    let password = this.formularioCambioPassword.controls['password_old'].value;
    let username = this.egresado.documento;
    let tipo = 3;
    this.usuarioServiceService.postValidarUsuario(username, CryptoJS.MD5(password).toString(), String(tipo)).subscribe(respuesta => {
      if (respuesta.status) {
        this.blockedDocument = false;
        this.permiteCambiarPassword = true;
      } else {
        this.blockedDocument = false;
        this.permiteCambiarPassword = false;
        this.addMessagesValidaPassword();
        this.formularioCambioPassword.reset();
        this.removeMessages();
      }
    });
  }

  validarFormularioCambiarPassword(): boolean {
    if (this.formularioCambioPassword.controls['password_new'].value == null || this.formularioCambioPassword.controls['password_new'].value.length == 0) {
      this.addMessagesCambiarPassword();
      this.removeMessages();
      return false;
    }

    if (this.formularioCambioPassword.controls['password_re'].value == null || this.formularioCambioPassword.controls['password_re'].value.length == 0) {
      this.addMessagesCambiarPassword();
      this.removeMessages();
      return false;
    }

    if (this.formularioCambioPassword.controls['password_new'].value !== this.formularioCambioPassword.controls['password_re'].value) {
      this.addMessagesValidaPasswordAndPassword();
      this.removeMessages();
      return false;
    }
    return true;
  }
}
