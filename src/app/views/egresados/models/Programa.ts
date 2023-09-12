import { Estado } from "./Estado";

export class Programa {
    id: number = 0;
    nombre_programa: string = "";
    estado_id: Estado = new Estado();
    activo: number = 0;
}