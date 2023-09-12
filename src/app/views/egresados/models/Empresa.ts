export class Empresa {
    id: number = 0;
    razon_social: string = "";
    nit: string = "";
    nombre: string = "";
    nombre2: string = "";
    apellido: string = "";
    apellido2: string = "";
    value: number = 0;
    tipoempresa_id: tipo_empresa = new tipo_empresa();
    tipo_empresa: tipo_empresa = new tipo_empresa();
    direccion: string = "";
    correo: string = "";
    telefono: string = "";
    celular: string = "";
    activo: number = 0;
    estado_id: number = 0;
}

export class tipo_empresa {
    id: number = 0;
    nombre_tipo_empresa: string = "";
}

