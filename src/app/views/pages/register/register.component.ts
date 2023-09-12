import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../egresados/models/Empresa';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { Router } from '@angular/router';
import { Programa } from '../../egresados/models/Programa';
import { ProgramaServiceService } from 'src/app/services/programa-service.service';
import { EgresadoServiceService } from 'src/app/services/egresado-service.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public blockedDocument: boolean = false;
  public programas: Programa[] = [];
  public estadocivil: any[] = [];
  public fechaCerrar: Date | undefined;
  empresa: Empresa = new Empresa();
  formulario: FormGroup = new FormGroup({});
  msgsModal: Message[] = [];
  validaCampos: boolean = false;
  sexos: any[] = [];
  fechaString: string = "";


  ngOnInit(): void {
    this.loadTextCalendar();
    this.cargarProgramas();
    this.cargarFormulario();
    this.cargarEstadoCivil();
    this.formulario.controls['celular'].setValue('');
  }

  constructor(
    private egresadoServiceService: EgresadoServiceService,
    private router: Router,
    private programaServiceService: ProgramaServiceService,
    private messageService: MessageService,
    private primeNGConfig: PrimeNGConfig,
  ) {
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
  }

  onBasicUploadAuto(event: { files: any; }) {
  }

  public cargarProgramas() {
    this.programaServiceService.getListarPrograma().subscribe((datos: any) => {
      this.programas = datos;
    })
  }

  public cargarEstadoCivil() {
    this.egresadoServiceService.getListarEstadoCivil().subscribe((datos: any) => {
      this.estadocivil = datos;
    })
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
      celular: new FormControl([], Validators.required),
      hoja_vida: new FormControl(''),
      activo: new FormControl(''),
      estado: new FormControl(''),
      password: new FormControl('', Validators.required),
      password_re: new FormControl('', Validators.required),
      observacion: new FormControl(''),
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
      const formData = {
        nombre: this.formulario.controls['nombre'].value,
        nombre2: this.formulario.controls['nombre2'].value,
        apellido: this.formulario.controls['apellido'].value,
        apellido2: this.formulario.controls['apellido2'].value,
        documento: this.formulario.controls['documento'].value,
        sexo: this.formulario.controls['sexo'].value.id,
        fecha_nac: this.fechaString,
        programa_id: this.formulario.controls['programa_id'].value.id,
        estado_id: 3,
        estadocivil_id: this.formulario.controls['estadocivil_id'].value.id,
        celular: this.formulario.controls['celular'].value,
        correo: this.formulario.controls['correo'].value,
        password: CryptoJS.MD5(this.formulario.controls['password'].value).toString(),
        password_re: CryptoJS.MD5(this.formulario.controls['password_re'].value).toString(),
        observacion: this.formulario.controls['observacion'].value,
      };
      this.egresadoServiceService.postRegistroEgresado(formData, null).subscribe((data: { status: string; mensaje: any; }) => {
        this.blockedDocument = false;
        if (data.status == 'success') {
          this.addMessagesRegistrado();
          this.remove();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
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

  addMessagesValidar(campo: string) {
    this.msgsModal = [
      { severity: 'error', summary: 'Error', detail: 'El ' + campo + ' no está disponible' }
    ]
  }

  addMessagesRegistrado() {
    this.msgsModal = [
      { severity: 'success', summary: 'Éxito', detail: 'Se ha registrado con éxito al egresado.' }
    ]
  }

  removeMessages() {
    setTimeout(() => {
      this.msgsModal = [];
    }, 3000);
  }

  validarFormulario(): boolean {
    if (this.formulario.controls['nombre'].value == null || this.formulario.controls['nombre'].value.length == 0) {
      this.addMessages("Nombre");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['apellido'].value == null || this.formulario.controls['apellido'].value.length == 0) {
      this.validaCampos = true;
      this.addMessages("Apellido");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['documento'].value == null || this.formulario.controls['documento'].value.length == 0) {
      this.validaCampos = true;
      this.addMessages("Documento");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['programa_id'].value == null || this.formulario.controls['programa_id'].value == '') {
      this.addMessages("Programa Técnico");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['sexo'].value == null || this.formulario.controls['sexo'].value == '') {
      this.addMessages("Sexo");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['fecha_nac'].value == null || this.formulario.controls['fecha_nac'].value == '') {
      this.addMessages("Fecha Nacimiento");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['estadocivil_id'].value == null || this.formulario.controls['estadocivil_id'].value == '') {
      this.addMessages("Estado Civil");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['correo'].value == null || this.formulario.controls['correo'].value.length == 0) {
      this.addMessages("Correo");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['celular'].value == null || this.formulario.controls['celular'].value.length == 0) {
      this.addMessages("Celular");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['password'].value == null || this.formulario.controls['password'].value.length == 0) {
      this.addMessages("Password");
      this.removeMessages();
      return false;
    }

    if (this.formulario.controls['password_re'].value == null || this.formulario.controls['password_re'].value.length == 0) {
      this.addMessages("Confirmar Password");
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


  seleccionarFecha() {
    this.fechaCerrar = this.formulario.controls['fecha_nac'].value;
    if (this.fechaCerrar) {
      const year: number = this.fechaCerrar.getFullYear();
      const month: number = this.fechaCerrar.getMonth() + 1;
      const day: number = this.fechaCerrar.getDate();
      this.fechaString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }
  }

  public validaEgresadoCorreo(correo: string) {
    this.egresadoServiceService.getValidaCorreo(correo).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Correo ");
        this.removeMessages();
        this.formulario.controls['correo'].setValue('');
      }
    })
  }

  public validaEgresadoDocumento(documento: string) {
    this.egresadoServiceService.getValidaDocumento(documento).subscribe((datos: any) => {
      if (datos == 0) {
        this.addMessagesValidar(" Documento ");
        this.removeMessages();
        this.formulario.controls['documento'].setValue('');
      }
    })
  }

  public validaEgresadoCelular(celular: string) {
    this.egresadoServiceService.getValidaCelular(celular).subscribe((datos: any) => {
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
    let documento = this.formulario.controls['documento'].value;
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
