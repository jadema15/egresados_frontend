import { Empresa } from "./Empresa";
import { Programa } from "./Programa";
import { Horario } from "./Horario";
import { Estado } from "./Estado";

export class Solicitud {
    id: number = 0;
    empresa_id: Empresa = new Empresa();
    programa: Programa = new Programa();
    descripcion: string = "";
    horario_id: Horario = new Horario();
    fecha_cerrar: Date | undefined;
    cantidad: number = 0;
    cantidad_postulados: number = 0;
    activo: number = 0;
    estado_id: Estado = new Estado();
}

