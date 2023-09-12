import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },

  {
    title: true,
    name: 'Configuración'
  },
  {
    name: 'Egresados',
    url: '/egresados/egresado',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Horarios',
    url: '/egresados/registro',
    iconComponent: { name: 'cil-calculator' }
  },
  {
    name: 'Programas',
    url: '/egresados/programa',
    iconComponent: { name: 'cil-star' }
  },
  {
    name: 'Empresas',
    url: '/egresados/empresa',
    iconComponent: { name: 'cil-puzzle' }
  },
  {
    name: 'Bolsa de Empleo',
    url: '/egresados',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Crear Solicitud',
        url: '/egresados/solicitud'
      },
      {
        name: 'Mis Postulaciones',
        url: '/egresados/solicitud-programas'
      }          
    ]
  } 
];
