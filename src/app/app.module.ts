import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AlertModule } from 'ngx-alerts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// tslint:disable-next-line:max-line-length
import {
  MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule,
  MatSelectModule, MatProgressSpinnerModule,
  MatInputModule,
  MatCheckboxModule, MAT_CHECKBOX_CLICK_ACTION
} from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ErrorPageComponent } from './error-page/error-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './services/auth-guard.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { SignupComponent } from './signup/signup.component';
import { CompanyComponent } from './master/company/company.component';
import { UserComponent } from './master/user/user.component';
import { ProjectComponent } from './master/project/project.component';
import { TicketTypeComponent } from './master/ticket-type/ticket-type.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EngineService } from './services/engine.service';
import { CreateUserComponent } from './master/user/create-user/create-user.component';
import { DashboardToolsComponent } from './dashboard/dashboard-tools/dashboard-tools.component';
import { CookieModule } from 'ngx-cookie';
import { CreateProjectComponent } from './master/project/create-project/create-project.component';
import { CreateCompanyComponent } from './master/company/create-company/create-company.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { CreateTicketComponent } from './transaction/create-ticket/create-ticket.component';
import { CreateTeamComponent } from './master/team/create-team/create-team.component';
import { TeamComponent } from './master/team/team.component';
import { CreateTicketTypeComponent } from './master/ticket-type/create-ticket-type/create-ticket-type.component';
import { EditUserDialogComponent } from './master/modal/edit-user-dialog/edit-user-dialog.component';
import { EditProjectComponent } from './master/modal/edit-project/edit-project.component';
import { EditCompanyComponent } from './master/modal/edit-company/edit-company.component';
import { EditTeamComponent } from './master/modal/edit-team/edit-team.component';
import { EditTicketTypeComponent } from './master/modal/edit-ticket-type/edit-ticket-type.component';

import { MeslogComponent } from './transaction/meslog/meslog.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { AlertComponent } from './master/modal/alert/alert.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditAuthGuard } from './services/edit-auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    DropdownDirective,
    ErrorPageComponent,
    PageNotFoundComponent,
    SignupComponent,
    CompanyComponent,
    UserComponent,
    ProjectComponent,
    TicketTypeComponent,
    CreateTeamComponent,
    DashboardComponent,
    EditUserDialogComponent,
    CreateUserComponent,
    DashboardToolsComponent,
    CreateProjectComponent,
    EditProjectComponent,
    CreateCompanyComponent,
    EditCompanyComponent,
    CreateTicketComponent,
    CreateTeamComponent,
    TeamComponent,
    CreateTicketTypeComponent,
    EditTeamComponent,
    EditTicketTypeComponent,
    MeslogComponent,
    TimeAgoPipe,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule,
    NgxDatatableModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatInputModule,
    MatMenuModule,
    NgxSpinnerModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 3000 })
  ],
  // tslint:disable-next-line:max-line-length
  entryComponents: [EditUserDialogComponent,
    EditProjectComponent,
    EditCompanyComponent,
    EditTeamComponent,
    EditTicketTypeComponent,
    AlertComponent,
    MeslogComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    AuthGuard,
    EditAuthGuard,
    CanDeactivateGuard,
    EngineService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  title = 'R-Support';
}
