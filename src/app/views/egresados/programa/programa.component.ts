import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProgramaServiceService } from 'src/app/services/programa-service.service';
import { Programa } from '../models/Programa';
import { Estado } from '../models/Estado';
import { ConfirmationService, Message, MessageService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.component.html',
  styleUrls: ['./programa.component.scss']
})
export class ProgramaComponent implements OnInit {

  public token: any;
  public programa: Programa = new Programa();
  public estado: Estado = new Estado();
  public blockedDocument: boolean = false;
  public accion: string = "";
  public boton: string = "";
  public estadoBoton: boolean = true;

  display: boolean = false;
  representatives: Programa[] = [];
  items: MenuItem[] = [];
  activos: Estado[] = [];
  msgsModal: Message[] = [];
  formulario: FormGroup = new FormGroup({});

  constructor(
    private programaServiceService: ProgramaServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      nombre_programa: new FormControl('', Validators.required),
      estado_id: new FormControl('', Validators.required),
      activo: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.cargarToken();
    this.cargarFormulario();
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
    this.programaServiceService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  public Registrar() {
    if (this.validarFormulario()) {
      this.blockedDocument = true;
      const formData = {
        nombre_programa: this.programa.nombre_programa,
        estado_id: this.formulario.controls['estado_id'].value.value,
        activo: 1
      };
      if (this.estadoBoton) {
        this.programaServiceService.postActualizarPrograma(formData, this.token).subscribe(data => {
          this.blockedDocument = false;
          if (data.status == 'success') {
            this.addSingle(data.status, "Exito", data.mensaje);
            this.remove();
            this.cargarEgresados();
            this.display = false;
          } else {
            this.addSingle(data.status, "Error", data.mensaje);
            this.remove();
          }
        });
      } else {
        this.programaServiceService.putRegistroPrograma(this.programa.id, formData, this.token).subscribe(data => {
          this.blockedDocument = false;
          if (data.status == 'success') {
            this.addSingle(data.status, "Exito", data.mensaje);
            this.remove();
            this.cargarEgresados();
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

  public cargarEgresados() {
    this.blockedDocument = true;
    this.programaServiceService.getListarPrograma().subscribe(datos => {
      this.representatives = datos;
      this.blockedDocument = false;
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

  editar(programa: Programa) {
    this.showDialog(false);
    this.programa.nombre_programa = programa.nombre_programa;
    let otra = programa.estado_id;
    let pru = this.activos.filter(x => x.value == Number(otra));
    this.programa.estado_id = pru[0];
    this.programa.id = programa.id;
  }

  eliminar(id: number) {
    this.programaServiceService.getEliminarPrograma(id).subscribe((data) => {
      this.cargarEgresados();
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
    if (this.formulario.controls['nombre_programa'].value == null || this.programa.nombre_programa?.length == 0) {
      this.addMessages();
      this.removeMessages();
      return false;
    }
    return true;
  }

}
