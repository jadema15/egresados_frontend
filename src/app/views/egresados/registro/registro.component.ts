import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HorariosServiceService } from 'src/app/services/horarios-service.service';
import { Horario } from '../models/Horario';
import { Estado } from '../models/Estado';
import { ConfirmationService, Message, MessageService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  public token: any;
  public horario: Horario = new Horario();
  public estado: Estado = new Estado();
  public blockedDocument: boolean = false;
  public contador: number = 1;
  public contadorActualizado: number = 0;
  public accion: string = "";
  public boton: string = "";
  public estadoBoton: boolean = true;

  display: boolean = false;
  representatives: Horario[] = [];
  items: MenuItem[] = [];
  activos: Estado[] = [];
  msgsModal: Message[] = [];
  formulario: FormGroup = new FormGroup({});

  constructor(
    private horariosServiceService: HorariosServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  cargarFormulario(): void {
    this.formulario = new FormGroup({
      nombre_horario: new FormControl('', Validators.required),
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

  public incrementarContador(): number {
    return this.contador++;
  }

  public cargarToken() {
    this.horariosServiceService.getToken().subscribe(x => {
      this.token = JSON.stringify(x);
      const jsonObject = JSON.parse(this.token);
      this.token = jsonObject.csrf_token;
    })
  }

  public Registrar() {
    if (this.validarFormulario()) {
      this.blockedDocument = true;
      const formData = {
        nombre_horario: this.horario.nombre_horario,
        estado_id: this.formulario.controls['estado_id'].value.value,
        activo: 1
      };
      if (this.estadoBoton) {
        this.horariosServiceService.postActualizarHorario(formData, this.token).subscribe(data => {
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
        this.horariosServiceService.putRegistroHorario(this.horario.id, formData, this.token).subscribe(data => {
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
    this.horariosServiceService.getListarHorario().subscribe(datos => {
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

  editar(horario: Horario) {
    this.showDialog(false);
    this.horario.nombre_horario = horario.nombre_horario;
    let otra = horario.estado_id;
    let pru = this.activos.filter(x => x.value == Number(otra));
    this.horario.estado_id = pru[0];
    this.horario.id = horario.id;
  }

  eliminar(id: number) {
    this.horariosServiceService.getEliminarHorario(id).subscribe((data) => {
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
    if (this.formulario.controls['nombre_horario'].value == null || this.horario.nombre_horario?.length == 0) {
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


