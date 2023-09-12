import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule, GridModule, NavModule, UtilitiesModule, TabsModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

// Theme Routing
import { ThemeRoutingModule } from './egresados-routing.module';
import { EgresadosComponent } from './egresados.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { RegistroComponent } from './registro/registro.component';


import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { BlockUIModule } from 'primeng/blockui';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { HorarioComponent } from './horario/horario.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { ProgramaComponent } from './programa/programa.component';
import { EgresadoComponent } from './egresado/egresado.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { SolicitudProgramasComponent } from './solicitud-programas/solicitud-programas.component'; 3
import { BadgeModule } from 'primeng/badge';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { EmpresaConfiguracionComponent } from './empresa-configuracion/empresa-configuracion.component';
import { EgresadoConfiguracionComponent } from './egresado-configuracion/egresado-configuracion.component';
import { AdminConfiguracionComponent } from './admin-configuracion/admin-configuracion.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeRoutingModule,
    CardModule,
    GridModule,
    UtilitiesModule,
    IconModule,
    NavModule,
    TabsModule,
    BadgeModule,
    ButtonModule,
    TableModule,
    MenuModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    MenubarModule,
    BlockUIModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    InputTextareaModule,
    InputNumberModule,
    CalendarModule
  ],
  declarations: [
    EgresadosComponent,
    RegistroComponent,
    HorarioComponent,
    EmpresasComponent,
    SolicitudComponent,
    ProgramaComponent,
    EgresadoComponent,
    SolicitudProgramasComponent,
    ConfiguracionComponent,
    EmpresaConfiguracionComponent,
    EgresadoConfiguracionComponent,
    AdminConfiguracionComponent
  ],
  providers: [ConfirmationService],
})
export class EgresadosModule {
}
