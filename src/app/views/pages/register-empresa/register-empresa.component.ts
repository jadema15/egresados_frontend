import { Component, OnInit } from '@angular/core';
import { EmpresaServiceService } from 'src/app/services/empresa-service.service';
import { Empresa, tipo_empresa } from '../../egresados/models/Empresa';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register-empresa',
  templateUrl: './register-empresa.component.html',
  styleUrls: ['./register-empresa.component.scss']
})
export class RegisterEmpresaComponent implements OnInit {

  public blockedDocument: boolean = false;
  tiposEmpresas: tipo_empresa[] = [];
  empresa: Empresa = new Empresa();
  formulario: FormGroup = new FormGroup({});
  public token: any;
  msgsModal: Message[] = [];
  validaCampos: boolean = false;
  ngOnInit(): void {
    this.loadTextCalendar();
    this.cargarTipoEmpresa();
    this.cargarFormulario();
  }

  constructor(
    private empresaServiceService: EmpresaServiceService,
    private router: Router,
    private messageService: MessageService,
    private primeNGConfig: PrimeNGConfig,
  ) {
  }

  public cargarTipoEmpresa() {
    this.empresaServiceService.getListarTipoEmpresa().subscribe(datos => {
      this.tiposEmpresas = datos;
    })
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      razon_social: new FormControl('', Validators.required),
      nit: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      nombre2: new FormControl('',),
      apellido: new FormControl('', Validators.required),
      apellido2: new FormControl('',),
      tipoempresa_id: new FormControl('', Validators.required),
      direccion: new FormControl(''),
      correo: new FormControl('', Validators.required),
      telefono: new FormControl('',),
      celular: new FormControl('', Validators.required),
      activo: new FormControl(''),
      estado_id: new FormControl(''),
      password: new FormControl('', Validators.required),
      password_re: new FormControl('', Validators.required),
    });
  }

  addSingle(severity: any, summary: any, detail: any) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  remove() {
    this.msgsModal = [];
  }

  public registrar() {
    if (this.validarFormulario()) {
      this.blockedDocument = true;
      let tipoEmpresa = this.formulario.controls['tipoempresa_id'].value.id;
      const formData = {
        razon_social: this.formulario.controls['razon_social'].value,
        nit: this.formulario.controls['nit'].value,
        nombre: this.formulario.controls['nombre'].value,
        nombre2: this.formulario.controls['nombre2'].value,
        apellido: this.formulario.controls['apellido'].value,
        apellido2: this.formulario.controls['apellido2'].value,
        tipoempresa_id: tipoEmpresa,
        direccion: this.formulario.controls['direccion'].value,
        correo: this.formulario.controls['correo'].value,
        telefono: this.formulario.controls['telefono'].value,
        celular: this.formulario.controls['celular'].value,
        activo: 1,
        estado_id: 3,
        password: CryptoJS.MD5(this.formulario.controls['password'].value).toString(),
      };
      this.empresaServiceService.postRegistroEmpresa(formData, this.token).subscribe(data => {
        this.blockedDocument = false;

        if (data.status == 'success') {
          this.addSingle(data.status, "Exito", data.mensaje);
          this.remove();
          this.router.navigate(['/login']);
        } else {
          this.addSingle(data.status, "Error", data.mensaje);
          this.remove();
        }
      });
    }
  }

  addMessages(campo: any) {
    this.msgsModal = [
      { severity: 'error', summary: 'Error', detail: 'El campo ' + campo + ' es requerido' }
    ]
  }

  addMessagesConfirmar() {
    this.msgsModal = [
      { severity: 'error', summary: 'Error', detail: 'El Password debe ser igual a la Confirmar password' }
    ]
  }

  removeMessages() {
    setTimeout(() => {
      this.msgsModal = [];
    }, 3000);
  }

  validarFormulario(): boolean {
    if (this.formulario.controls['nit'].value == null || this.formulario.controls['nit'].value.length == 0) {
      this.validaCampos = true;
      this.addMessages("Nit ");
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['razon_social'].value == null || this.formulario.controls['razon_social'].value.length == 0) {
      this.validaCampos = true;
      this.addMessages(" Razón Social ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['nombre'].value == null || this.formulario.controls['nombre'].value.length == 0) {
      this.validaCampos = true;
      this.addMessages(" Nombre ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['apellido'].value == null || this.formulario.controls['apellido'].value.length == 0) {
      this.addMessages(" Apellido ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['tipoempresa_id'].value == null || this.formulario.controls['tipoempresa_id'].value == '') {
      this.addMessages(" Tipo Empresa ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['correo'].value == null || this.formulario.controls['correo'].value.length == 0) {
      this.validaCampos = true;
      this.addMessages(" Correo ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['celular'].value == null || this.formulario.controls['celular'].value.length == 0) {
      this.addMessages(" celular ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['password'].value == null || this.formulario.controls['password'].value.length == 0) {
      this.addMessages(" Password ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['password_re'].value == null || this.formulario.controls['password_re'].value.length == 0) {
      this.addMessages(" Confirmar Password ");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['password'].value !== this.formulario.controls['password_re'].value) {
      this.addMessagesConfirmar();
      this.removeMessages();
      return false;
    }

    return true;
  }

  public cargarToken() {
    this.empresaServiceService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  public validaConfirmacionPassword() {
    let password = this.formulario.controls['password'].value;
    let password_re = this.formulario.controls['password_re'].value;
    return password === password_re;
  }

  addMessagesValidar(campo: string) {
    this.msgsModal = [
      { severity: 'error', summary: 'Error', detail: 'El ' + campo + ' no está disponible' }
    ]
  }

  public validaEgresadoCorreo(correo: string) {
    this.empresaServiceService.getValidaCorreo(correo).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Correo ");
        this.removeMessages();
        this.formulario.controls['correo'].setValue('');
      }
    })
  }

  public validaEgresadoDocumento(documento: string) {
    this.empresaServiceService.getValidaDocumento(documento).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Nit ");
        this.removeMessages();
        this.formulario.controls['nit'].setValue('');
      }
    })
  }

  public validaEgresadoCelular(celular: string) {
    this.empresaServiceService.getValidaCelular(celular).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Celular ");
        this.removeMessages();
        this.formulario.controls['celular'].setValue('');
      }
    })
  }

  validaCorreo() {
    let correo = this.formulario.controls['correo'].value;
    this.validaEgresadoCorreo(correo);
  }

  validaDocumento() {
    let documento = this.formulario.controls['nit'].value;
    this.validaEgresadoDocumento(documento);
  }

  validaCelular() {
    let celular = this.formulario.controls['celular'].value;
    this.validaEgresadoCelular(celular);
  }

  regresar() {
    this.router.navigate(['/login']);
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


