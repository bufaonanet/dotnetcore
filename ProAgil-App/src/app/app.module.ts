import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from "ngx-currency";

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { TituloComponent } from './_shared/titulo/titulo.component';
import { EventosComponent } from './eventos/eventos.component';
import { EventoService } from './_services/evento.service';
import { ContatosComponent } from './contatos/contatos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';

import { DateTimeFormatPipe } from './util/DateTimeFormat.pipe';
import { AuthInterceptor } from './auth/AuthInterceptor';
import { EventoEditComponent } from './eventos/evento-edit/evento-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TituloComponent,
    EventosComponent,
    EventoEditComponent,
    ContatosComponent,
    DashboardComponent,
    PalestrantesComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    DateTimeFormatPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    BrowserAnimationsModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 1500,
      preventDuplicates: true,
    }),
    ReactiveFormsModule,
    NgxCurrencyModule
  ],
  providers: [
    EventoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
