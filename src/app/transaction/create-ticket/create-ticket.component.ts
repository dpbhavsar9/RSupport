import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../services/engine.service';
import { CookieService } from 'ngx-cookie';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {

  url: any;
  createTicketForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  allTicketTypeList: any[] = [];
  ticketTypeList: any[] = [];
  teamList: any[] = [];
  assignToUserList: any[];
  fileToUpload: File = null;
  // tslint:disable-next-line:max-line-length
  priorityList: any[] = [{ value: 'High', viewValue: 'High' }, { value: 'Medium', viewValue: 'Medium' }, { value: 'Low', viewValue: 'Low' }];

  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService,
    private router: Router,
    private engineService: EngineService,
    private dashboard: DashboardComponent,
    private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompany();
    // this.loadAssignTo();
    this.loadTicketType();
    // this.loadTeams();
  }

  prepareForm() {
    this.createTicketForm = new FormGroup({

      CompanyID: new FormControl(null, Validators.required),
      ProjectID: new FormControl(null, Validators.required),
      TicketType: new FormControl(null, Validators.required),
      Priority: new FormControl(null, Validators.required),
      Subject: new FormControl(null, Validators.required),
      TicketDescription: new FormControl(null, Validators.required),
      TeamID: new FormControl(null, Validators.required),
      AssignTo: new FormControl(null),
      CreatedBy: new FormControl(this._cookieService.get('Oid'))
    });
  }

  loadCompany() {
    // Company Dropdown - start
    this.url = 'Company/GetAllCompany';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.companyList = res;
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadCompany');
      });
    // Company Dropdown - end
  }

  loadProjects() {
    const CompanyID = this.createTicketForm.get('CompanyID').value;
    // // console.log(CompanyID);
    // Company Dropdown - start
    this.url = 'Project/GetProject';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.projectList = res.filter(data => data.ProjectCompany === CompanyID);
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadCompany');
      });
    // Company Dropdown - end
  }

  loadTeams() {
    const ProjectID = this.createTicketForm.get('ProjectID').value;
    this.url = 'Team/GetTeamProject/' + ProjectID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        this.teamList = res.filter(data => data.ProjectID === ProjectID);
      })
      .catch(err => {
        this.alertService.danger('Server response error! @loadTeam');
      });
  }



  loadTeamMembers() {
    const TeamID = this.createTicketForm.get('TeamID').value;
    this.url = 'Users/GetTeamMembers/' + TeamID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.assignToUserList = res;
      })
      .catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error!');
      });
  }

  loadTicketType() {
    // TicketType Dropdown - start
    this.url = 'Ticket/GetTicketType';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.allTicketTypeList = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });
    // TicketType Dropdown - end
  }

  handleFileInput(files: FileList) {
    const fileItem = files.item(0);
    // console.log("---1------Handle", fileItem)
    this.fileToUpload = fileItem;
    this.engineService.uploadFile(this.fileToUpload).then(res => {
      console.log('----- File Upload -----', JSON.stringify(res._body));
    }).catch(err => {
      console.log('----- Error Uploading File -----', err);
    });
  }

  updateTicketType() {
    this.ticketTypeList = this.allTicketTypeList.filter(x =>
      x.CompanyID === this.createTicketForm.get('CompanyID').value && x.ProjectID === this.createTicketForm.get('ProjectID').value);
  }

  createTicket() {

    if (this.createTicketForm.status === 'VALID') {
      // console.log(this.createTicketForm.value);
      this.url = 'Ticket/PostTicket';
      this.engineService.postData(this.url, this.createTicketForm.value).then(response => {
        if (response.status === 201 || response.status === 200) {
          this.dashboard.ngOnInit();
          this.alertService.success('Ticket successfully created!');
          this.router.navigate(['dashboard']);
        }
      }).catch(error => {
        // console.log(error);
        this.alertService.danger('Ticket creation failed!');
      });
    }
  }
}

