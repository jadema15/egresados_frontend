import { Solicitud } from "./solicitud";

export class SolicitudPrograma {
    id: number = 0;
    egresado_id: number = 0;
    estado_id: number = 0;
    solicitud: Solicitud = new Solicitud();
    created_at: Date = new Date();
}