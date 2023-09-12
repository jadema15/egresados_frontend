import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { Message, MessageService } from 'primeng/api';
import { Usuarios } from '../models/Usuarios';
import { EmpresaServiceService } from 'src/app/services/empresa-service.service';
import { Empresa, tipo_empresa } from '../models/Empresa';
import { CambioPassword } from '../models/CambioPassword';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-empresa-configuracion',
  templateUrl: './empresa-configuracion.component.html',
  styleUrls: ['./empresa-configuracion.component.scss']
})
export class EmpresaConfiguracionComponent implements OnInit {
  public token: any;
  public blockedDocument: boolean = false;
  public dialogHeight = '80vh';
  public fechaCerrar: Date | undefined;
  public usuarios: Usuarios = new Usuarios();
  public empresa: Empresa = new Empresa();
  public cambioPassword: CambioPassword = new CambioPassword();
  display: boolean = false;
  empresa_id: number = 0;
  tipo_rol_id: number = 0;
  existeEmpresa: boolean = false;
  programa_id: number = 0;
  existeEgresado: boolean = false;
  msgsModal: Message[] = [];
  msgsModalCambiarPassword: Message[] = [];
  tiposEmpresas: tipo_empresa[] = [];
  formulario: FormGroup = new FormGroup({});
  formularioCambioPassword: FormGroup = new FormGroup({});
  objeto: any;
  visualizarUpdatePassword: boolean = false;
  permiteCambiarPassword: boolean = false;

  constructor(
    private solicitudService: SolicitudServiceService,
    private usuarioServiceService: UsuarioServiceService,
    private messageService: MessageService,
    private empresaServiceService: EmpresaServiceService
  ) {
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      nombre2: new FormControl(''),
      apellido: new FormControl('', Validators.required),
      apellido2: new FormControl('',),
      nit: new FormControl('', Validators.required),
      razon_social: new FormControl('', Validators.required),
      tipoempresa_id: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      celular: new FormControl('', Validators.required),
      telefono: new FormControl(''),
      correo: new FormControl('', Validators.required),
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
    this.cargarFormulario();
    this.cargarFormularioCambioPassword();
    this.cargarTipoEmpresa();
    this.cargarEmpresa(this.objeto.id);
    this.cargarDatosUsuario();
    this.cargarToken();
  }
  async cargarTipoEmpresa() {
    await this.empresaServiceService.getListarTipoEmpresa().subscribe(datos => {
      this.tiposEmpresas = datos;
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
    if (this.formulario.controls['nombre'].value == null || this.empresa.nombre?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['apellido'].value == null || this.empresa.apellido?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['nit'].value == null || this.empresa.nit?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['razon_social'].value == null || this.empresa.razon_social?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['celular'].value == null || this.empresa.celular?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['direccion'].value == null || this.empresa.direccion?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['correo'].value == null || this.empresa.correo?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    return true;
  }

  async cargarEmpresa(id: number) {
    this.blockedDocument = true;
    await this.empresaServiceService.getEmpresaById(id).subscribe(datos => {
      this.empresa.id = datos.id;
      this.empresa.razon_social = datos.razon_social;
      this.empresa.nit = datos.nit;
      this.empresa.nombre = datos.nombre;
      this.empresa.nombre2 = datos.nombre2;
      this.empresa.apellido = datos.apellido;
      this.empresa.apellido2 = datos.apellido2;
      this.empresa.direccion = datos.direccion;
      this.empresa.correo = datos.correo;
      this.empresa.telefono = datos.telefono;
      this.empresa.celular = datos.celular;
      this.empresa.activo = datos.activo;
      this.empresa.estado_id = datos.estado_id;
      let empresaFiltrada = this.tiposEmpresas.filter(emp => emp.id == Number(datos.tipoempresa_id));
      this.empresa.tipoempresa_id = empresaFiltrada[0];
      this.blockedDocument = false;
    });
  }

  actualizarEmpresa() {
    this.blockedDocument = true;
    if (this.validarFormulario()) {
      const formData = {
        id: this.empresa.id,
        razon_social: this.empresa.razon_social,
        nit: this.empresa.nit,
        nombre: this.empresa.nombre,
        nombre2: this.empresa.nombre2,
        apellido: this.empresa.apellido,
        apellido2: this.empresa.apellido2,
        tipoempresa_id: this.formulario.controls['tipoempresa_id'].value.id,
        direccion: this.empresa.direccion,
        correo: this.empresa.correo,
        telefono: this.empresa.telefono,
        celular: this.empresa.celular,
        activo: this.empresa.activo,
        estado_id: this.empresa.estado_id
      };
      this.empresaServiceService.putActualizarEmpresa(this.empresa.id, formData, this.token).subscribe(data => {
        this.blockedDocument = false;
        if (data.status == 'success') {
          this.addSingle(data.status, "Exito", data.mensaje);
          this.remove();
          this.display = false;
        } else {
          this.addSingle(data.status, "Error", data.mensaje);
          this.remove();
        }
      });
    }
  }

  cerrarModalActualizarPassword() {
    this.visualizarUpdatePassword = false;
    this.permiteCambiarPassword = false;
  }

  modalActualizarPassword() {
    this.formularioCambioPassword.reset();
    this.visualizarUpdatePassword = true;
  }

  CambiarPassword() {
    if (this.validarFormularioCambiarPassword()) {
      this.blockedDocument = true;
      const formData = {
        id: String(this.empresa.id),
        password: CryptoJS.MD5(this.formularioCambioPassword.controls['password_new'].value).toString(),
      };
      this.empresaServiceService.postCambiarPassword(formData).subscribe(data => {
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
    let username = this.empresa.nit;
    let tipo = 2;
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

  addMessagesValidaPassword() {
    let mensaje = "La contraseña ingresada es incorrecta"
    this.msgsModalCambiarPassword = [
      { severity: 'error', summary: 'Error', detail: mensaje }
    ]
  }

  addMessagesCambiarPassword() {
    this.msgsModalCambiarPassword = [
      { severity: 'error', summary: 'Error', detail: 'Se requieren los campos indicados como requeridos' }
    ]
  }

  addMessagesValidaPasswordAndPassword() {
    let mensaje = "Las contraseñas ingresadas no coinciden"
    this.msgsModalCambiarPassword = [
      { severity: 'error', summary: 'Error', detail: mensaje }
    ]
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
