import { EstadoCivil } from './EstadoCivil';
import { Programa } from './Programa';
export class Egresado {
    id: number = 0;
    nombre: string = "";
    nombre2: string = "";
    apellido: string = "";
    apellido2: string = "";
    documento: string = "";
    sexo: number = 0;
    fecha_nac: Date = new Date();
    estado_id: number = 0;
    estadocivil_id: EstadoCivil = new EstadoCivil();
    celular: string = "";
    correo: string = "";
    programa_id: Programa = new Programa();
    password: string = "";
    observacion: string = "";
    hoja_vida: number = 0;
    foto: number = 0;
}