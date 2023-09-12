import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SolicitudServiceService } from 'src/app/services/solicitud-service.service';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import { Usuarios } from '../models/Usuarios';
import { CambioPassword } from '../models/CambioPassword';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  public token: any;
  public blockedDocument: boolean = false;
  public dialogHeight = '80vh';
  public fechaCerrar: Date | undefined;
  public usuarios: Usuarios = new Usuarios();
  public usuariosRegistro: Usuarios = new Usuarios();
  public cambioPassword: CambioPassword = new CambioPassword();
  display: boolean = false;
  empresa_id: number = 0;
  tipo_rol_id: number = 0;
  existeEmpresa: boolean = false;
  programa_id: number = 0;
  existeEgresado: boolean = false;
  msgsModal: Message[] = [];
  msgsModalRegistro: Message[] = [];
  msgsModalCambiarPassword: Message[] = [];
  items: MenuItem[] = [];
  formulario: FormGroup = new FormGroup({});
  formularioRegistro: FormGroup = new FormGroup({});
  formularioCambioPassword: FormGroup = new FormGroup({});
  objeto: any;
  visualizarUpdatePassword: boolean = false;
  permiteCambiarPassword: boolean = false;

  constructor(
    private solicitudService: SolicitudServiceService,
    private messageService: MessageService,
    private usuarioServiceService: UsuarioServiceService
  ) {
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      nombre2: new FormControl(''),
      apellido: new FormControl('', Validators.required),
      apellido2: new FormControl('',),
      documento: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      celular: new FormControl('', Validators.required)
    });
  }

  cargarFormularioRegistro(): void {
    this.formularioRegistro = new FormGroup({
      nombre: new FormControl('', Validators.required),
      nombre2: new FormControl(''),
      apellido: new FormControl('', Validators.required),
      apellido2: new FormControl('',),
      documento: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      celular: new FormControl('', Validators.required)
    });
  }

  cargarFormularioCambioPassword(): void {
    this.formularioCambioPassword = new FormGroup({
      password_old: new FormControl('', Validators.required),
      password_new: new FormControl('', Validators.required),
      password_re: new FormControl('', Validators.required)
    });
  }

  modalActualizarPassword() {
    this.formularioCambioPassword.reset();
    this.visualizarUpdatePassword = true;
  }

  ngOnInit(): void {
    const usuarioSesion = localStorage.getItem('user');
    let usuarioSesionString = String(usuarioSesion);
    this.objeto = JSON.parse(usuarioSesionString);
    this.cargarUsuario(this.objeto.id);
    this.cargarDatosUsuario();
    this.cargarToken();
    this.cargarFormulario();
    this.cargarFormularioRegistro();
    this.cargarFormularioCambioPassword();
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.showDialog(true);
        }
      }
    ];
  }

  Registrar() {
    this.blockedDocument = true;
    if (this.validarFormularioRegistro()) {
      const formData = {
        nombre: this.usuariosRegistro.nombre,
        nombre2: this.usuariosRegistro.nombre2,
        apellido: this.usuariosRegistro.apellido,
        apellido2: this.usuariosRegistro.apellido2,
        documento: this.usuariosRegistro.documento,
        email: this.usuariosRegistro.email,
        celular: this.usuariosRegistro.celular
      };
      this.usuarioServiceService.postRegistrarUsuario(formData).subscribe(data => {
        this.blockedDocument = false;
        if (data.status == 'success') {
          this.addSingle(data.status, "Exito", data.mensaje);
          this.remove();
          this.formularioRegistro.reset();
          this.display = false;
        } else {
          this.addSingle(data.status, "Error", data.mensaje);
          this.remove();
        }
      });
    }
  }

  showDialog(estado?: boolean) {
    this.display = true;
  }

  cerrarModal() {
    this.display = false;
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
      this.msgsModalRegistro = [];
      this.msgsModalCambiarPassword = [];
    }, 3000);
  }

  remove() {
    this.msgsModal = [];
  }

  validarFormulario(): boolean {
    if (this.formulario.controls['nombre'].value == null || this.usuarios.nombre?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['apellido'].value == null || this.usuarios.apellido?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['documento'].value == null || this.usuarios.documento?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['email'].value == null || this.usuarios.email?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['celular'].value == null || this.usuarios.celular?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    return true;
  }

  validarFormularioRegistro() {
    if (this.formularioRegistro.controls['nombre'].value == null || this.usuariosRegistro.nombre?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formularioRegistro.controls['apellido'].value == null || this.usuariosRegistro.apellido?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formularioRegistro.controls['documento'].value == null || this.usuariosRegistro.documento?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formularioRegistro.controls['email'].value == null || this.usuariosRegistro.email?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formularioRegistro.controls['celular'].value == null || this.usuariosRegistro.celular?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    return true;
  }


  async cargarUsuario(id: number) {
    this.blockedDocument = true;
    await this.usuarioServiceService.getUsuarioById(id).subscribe(datos => {
      this.usuarios.id = datos[0].id;
      this.usuarios.nombre = datos[0].nombre;
      this.usuarios.nombre2 = datos[0].nombre2;
      this.usuarios.apellido = datos[0].apellido;
      this.usuarios.apellido2 = datos[0].apellido2;
      this.usuarios.documento = datos[0].documento;
      this.usuarios.email = datos[0].email;
      this.usuarios.celular = datos[0].celular;
      this.blockedDocument = false;
    })
  }

  actualizarUsuario() {
    this.blockedDocument = true;
    if (this.validarFormulario()) {
      const formData = {
        id: this.usuarios.id,
        nombre: this.usuarios.nombre,
        nombre2: this.usuarios.nombre2,
        apellido: this.usuarios.apellido,
        apellido2: this.usuarios.apellido2,
        documento: this.usuarios.documento,
        email: this.usuarios.email,
        celular: this.usuarios.celular
      };
      this.usuarioServiceService.putActualizarUsuario(this.usuarios.id, formData, this.token).subscribe(data => {
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

  addMessagesValidar(campo: string) {
    this.msgsModalRegistro = [
      { severity: 'error', summary: 'Error', detail: 'El ' + campo + ' no está disponible' }
    ]
  }

  public validaEgresadoCorreo(correo: string) {
    this.usuarioServiceService.getValidaCorreo(correo).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Correo ");
        this.removeMessages();
        this.formularioRegistro.controls['correo'].setValue('');
      }
    })
  }

  public validaEgresadoDocumento(documento: string) {
    this.usuarioServiceService.getValidaDocumento(documento).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Documento ");
        this.removeMessages();
        this.formularioRegistro.controls['documento'].setValue('');
      }
    })
  }

  public validaEgresadoCelular(celular: string) {
    this.usuarioServiceService.getValidaCelular(celular).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Celular ");
        this.removeMessages();
        this.formularioRegistro.controls['celular'].setValue('');
      }
    })
  }

  validaCorreo() {
    let correo = this.formulario.controls['correo'].value;
    this.validaEgresadoCorreo(correo);
  }

  validaDocumento() {
    let documento = this.formulario.controls['documento'].value;
    this.validaEgresadoDocumento(documento);
  }

  validaCelular() {
    let celular = this.formulario.controls['celular'].value;
    this.validaEgresadoCelular(celular);
  }

  CambiarPassword() {
    if (this.validarFormularioCambiarPassword()) {
      this.blockedDocument = true;
      const formData = {
        id: String(this.usuarios.id),
        password: CryptoJS.MD5(this.formularioCambioPassword.controls['password_new'].value).toString(),
      };
      this.usuarioServiceService.postCambiarPassword(formData).subscribe(data => {
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
    let username = this.usuarios.documento;
    let tipo = 1;
    this.usuarioServiceService.postValidarUsuario(String(username), CryptoJS.MD5(password).toString(), String(tipo)).subscribe(respuesta => {
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

  cerrarModalActualizarPassword() {
    this.visualizarUpdatePassword = false;
    this.permiteCambiarPassword = false;
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
    if (this.formularioCambioPassword.controls['password_new'].value == null || this.formularioCambioPassword.controls['password_new'].value.length == 0 || this.formularioCambioPassword.controls['password_new'].value.length < 6) {
      this.addMessagesCambiarPassword();
      this.removeMessages();
      return false;
    }

    if (this.formularioCambioPassword.controls['password_re'].value == null || this.formularioCambioPassword.controls['password_re'].value.length == 0 || this.formularioCambioPassword.controls['password_re'].value.length < 6) {
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