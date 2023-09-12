import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioServiceService } from 'src/app/services/usuario-service.service';
import { Usuario } from '../../egresados/models/Usuario';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('tipoUsuarioInput') tipoUsuarioInput: DropdownModule = "";

  constructor(private usuarioServiceService: UsuarioServiceService,
    private messageService: MessageService,  
    private router: Router) { }

  public token: any;
  public dialogHeight = '52vh';
  public blockedDocument: boolean = false;
  controlRestablecer: boolean = true;
  display: boolean = false;
  error: boolean = false;
  usuario = new Usuario();
  username: string = '';
  password: string = '';
  tipo_id: number = 0;
  formulario: FormGroup = new FormGroup({});
  textoError: string = '';
  msgsModal: Message[] = [];
  listaUsuario: any[] = [];

  ngOnInit(): void {
    this.cargarToken();  
    this.cargarFormulario();
    this.cargarTipoUsuario();
  }

  cargarTipoUsuario() {
    this.listaUsuario = [
      {
        id: 3,
        nombre: "Egresado"
      },
      {
        id: 2,
        nombre: "Empresa"
      },
      {
        id: 1,
        nombre: "Administrador"
      }
    ]
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      documento: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rol_id: new FormControl('', Validators.required)
    });
  }

  public cargarToken() {
    this.usuarioServiceService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  validaUsuario(tipoId: any) {
    const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
    const username = usernameInput.value;
    const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
    const password = passwordInput.value;
    const tipo = tipoId;
    this.blockedDocument = true;
    this.usuarioServiceService.postValidarUsuario(username, CryptoJS.MD5(password).toString(), tipo).subscribe(respuesta => {
      if (respuesta.status) {
        this.router.navigate(['/egresados']);
        localStorage.setItem("valida", "ok");
        const jsonString = JSON.stringify(respuesta);
        localStorage.setItem("user", jsonString);
        this.blockedDocument = false;
      } else {
        this.blockedDocument = false;
        this.textoError = respuesta.error;
        this.error = true;
      }
    })
  }

  convertObjectToString(objeto: any) {
    const userDataString: string = JSON.stringify(objeto);
    return userDataString;
  }

  restablecer(tipoUsuario: number) {
    this.blockedDocument = true;
    this.display = true;
    this.controlRestablecer = false;
    const correoInput = document.getElementById('correoInput') as HTMLInputElement;
    const correo = correoInput.value;
    if (this.quitarEspacios(correo).length > 5 && this.tieneEspacios(correo)) {
      const formData = {
        correo: correo,
        tipo_usuario: tipoUsuario,
        tipo_correo: 2
      }
      this.usuarioServiceService.postRestablecerPassword(formData).subscribe(data => {
        if (data.status == "success") {
          this.blockedDocument = false;
          this.addSingle("success", "Restaurar Password", data.mensaje);
        } else {
          this.blockedDocument = false;
          this.addSingle("info", "Error Restaurar", data.mensaje);
        }
      });
    } else {
      this.addSingle("error", "Error Formulario", "Ingrese el correo");
      this.blockedDocument = false;
    }
  }
  quitarEspacios(cadena: any) {
    return cadena.replace(/\s+/g, '');
  }

  tieneEspacios(cadena: any) {
    return /^\S+$/.test(cadena);
  }

  abrirModal() {
    this.display = true;
    this.controlRestablecer = false;
  }

  cerrarModal() {
    this.display = false;
    this.controlRestablecer = true;
  }

  addMessages() {
    this.msgsModal = [
      { severity: 'info', summary: '', detail: 'Si el correo ingresado se encuentra registrado, se realizará el restablecimiento de password' }
    ]
  }

  addSingle(severity: any, summary: any, detail: any) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
}