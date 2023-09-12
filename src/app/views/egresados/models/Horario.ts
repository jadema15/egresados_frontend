import { Estado } from "./Estado";

export class Horario {
    id: number = 0;
    nombre_horario: string | undefined;
    estado_id: Estado = new Estado();
    activo: number = 0
}