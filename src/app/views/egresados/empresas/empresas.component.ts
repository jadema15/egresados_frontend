import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmpresaServiceService } from 'src/app/services/empresa-service.service';
import { Empresa, tipo_empresa } from '../models/Empresa';
import { Estado } from '../models/Estado';
import { ConfirmationService, Message, MessageService, MenuItem } from 'primeng/api';
import { MD5 } from 'crypto-js';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  public token: any;
  public empresa: Empresa = new Empresa();
  public estado: Estado = new Estado();
  public blockedDocument: boolean = false;
  public contador: number = 1;
  public contadorActualizado: number = 0;
  public accion: string = "";
  public boton: string = "";
  public estadoBoton: boolean = true;
  public dialogHeight = '70vh';

  display: boolean = false;
  representatives: Empresa[] = [];
  tiposEmpresas: tipo_empresa[] = [];
  items: MenuItem[] = [];
  activos: Estado[] = [];
  msgsModal: Message[] = [];
  formulario: FormGroup = new FormGroup({});

  constructor(
    private empresaServiceService: EmpresaServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
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
      direccion: new FormControl('', Validators.required),
      correo: new FormControl('', Validators.required),
      telefono: new FormControl('',),
      celular: new FormControl('', Validators.required),
      activo: new FormControl('', Validators.required),
      estado_id: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.cargarToken();
    this.cargarFormulario();
    this.cargarEmpresa();
    this.cargarTipoEmpresa();
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

  public incrementarContador(): number {
    return this.contador++;
  }

  public cargarToken() {
    this.empresaServiceService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  public Registrar() {
    if (this.validarFormulario()) {
      this.blockedDocument = true;
      let tipoEmpresa = this.formulario.controls['tipoempresa_id'].value;
      let estado = this.formulario.controls['estado_id'].value;
      const formData = {
        razon_social: this.empresa.razon_social,
        nit: this.empresa.nit,
        nombre: this.empresa.nombre,
        nombre2: this.empresa.nombre2,
        apellido: this.empresa.apellido,
        apellido2: this.empresa.apellido2,
        tipoempresa_id: tipoEmpresa.id,
        direccion: this.empresa.direccion,
        correo: this.empresa.correo,
        telefono: this.empresa.telefono,
        celular: this.empresa.celular,
        password: MD5(this.empresa.nit).toString(),
        activo: 1,
        estado_id: estado.value,
      };
      if (this.estadoBoton) {
        this.empresaServiceService.postRegistroEmpresa(formData, this.token).subscribe(data => {
          this.blockedDocument = false;
          if (data.status == 'success') {
            this.addSingle(data.status, "Exito", data.mensaje);
            this.remove();
            this.cargarEmpresa();
            this.display = false;
          } else {
            this.addSingle(data.status, "Error", data.mensaje);
            this.remove();
          }
        });
      } else {
        this.empresaServiceService.putActualizarEmpresa(this.empresa.id, formData, this.token).subscribe(data => {
          this.blockedDocument = false;
          if (data.status == 'success') {
            this.addSingle(data.status, "Exito", data.mensaje);
            this.remove();
            this.cargarEmpresa();
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

  public cargarEmpresa() {
    this.blockedDocument = true;
    this.empresaServiceService.getListarEmpresa().subscribe(datos => {
      this.representatives = datos;
      this.blockedDocument = false;
    })
  }

  public cargarTipoEmpresa() {
    this.empresaServiceService.getListarTipoEmpresa().subscribe(datos => {
      this.tiposEmpresas = datos;
    })
  }

  showDialog(estado: boolean) {
    estado ? this.accion = "Registrar" : this.accion = "Editar";
    estado ? this.boton = "Guardar" : this.boton = "Actualizar";
    if (estado) {
      this.formulario.reset();
    }
    this.estadoBoton = estado;
    this.display = true;
  }

  editar(empresa: Empresa) {
    this.showDialog(false);
    this.empresa.id = empresa.id;
    this.empresa.razon_social = empresa.razon_social;
    this.empresa.nit = empresa.nit;
    this.empresa.nombre = empresa.nombre;
    this.empresa.nombre2 = empresa.nombre2 ? empresa.nombre2 : '';
    this.empresa.apellido = empresa.apellido;
    this.empresa.apellido2 = empresa.apellido2 ? empresa.apellido2 : '';
    this.empresa.direccion = empresa.direccion;
    this.empresa.correo = empresa.correo;
    this.empresa.celular = empresa.celular;
    this.empresa.telefono = empresa.telefono ? empresa.telefono : '';
    this.empresa.estado_id = empresa.estado_id;
    this.empresa.tipoempresa_id = empresa.tipo_empresa;
  }

  eliminar(id: number) {
    this.empresaServiceService.getEliminarEmpresa(id).subscribe((data) => {
      this.cargarEmpresa();
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

  validarFormulario(): boolean {
    if (this.formulario.controls['razon_social'].value == null || this.empresa.razon_social?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    if (this.formulario.controls['estado_id'].value == null) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    return true;
  }

}
