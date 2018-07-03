import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EngineService } from '../../../services/engine.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-create-ticket-type',
  templateUrl: './create-ticket-type.component.html',
  styleUrls: ['./create-ticket-type.component.scss']
})
export class CreateTicketTypeComponent implements OnInit {

  url: any;
  createTicketTypeForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  status = [
    { value: 'A', viewValue: 'Active' },
    { value: 'C', viewValue: 'Inactive' }
  ];
  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService, private router: Router, private engineService: EngineService, private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompanies();

  }

  prepareForm() {
    this.createTicketTypeForm = new FormGroup({
      TypeName: new FormControl(null, Validators.required),
      CompanyID: new FormControl(null, Validators.required),
      ProjectID: new FormControl(null, Validators.required),
      Status: new FormControl(null, Validators.required),
      CreatedBy: new FormControl(this._cookieService.get('Oid'))
    });
  }

  loadCompanies() {
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
    const company = this.createTicketTypeForm.get('CompanyID').value;
    // console.log(company);
    // Company Dropdown - start
    this.url = 'Project/GetProject';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.projectList = res.filter(data => data.ProjectCompany === company);
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadProjects');
      });
    // Company Dropdown - end
  }


  createTicketType() {
    this.engineService.validateUser();
    if (this.createTicketTypeForm.status === 'VALID') {

      this.url = 'Ticket/PostTicketType';
      this.engineService.postData(this.url, this.createTicketTypeForm.value).then(response => {
        if (response.status === 201) {
          this.alertService.success('Ticket-type successfully created!');
          this.router.navigate(['dashboard']);
        }
      }).catch(error => {
        this.alertService.danger('Ticket-type creation failed!');
      });
    }
  }
}
