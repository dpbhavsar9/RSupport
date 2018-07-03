import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../../services/engine.service';
import { CookieService } from 'ngx-cookie';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  url: any;
  createProjectForm: FormGroup;
  allUsers: any[];
  usersList: any[];
  clientUsersList: any[];
  companyList: any[];
  fileToUpload: File = null;

  status = [
    { value: 'A', viewValue: 'Active' },
    { value: 'C', viewValue: 'Inactive' }
  ];
  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService, private router: Router, private engineService: EngineService, private _cookieService: CookieService) { }

  ngOnInit() {

    this.url = 'Users/GetAllUser';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.allUsers = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });

    this.url = 'Company/GetAllCompany';
    // Company Dropdown - start
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        this.companyList = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });
    // Company Dropdown - end


    this.createProjectForm = new FormGroup({

      ProjectName: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150)
      ]),
      ProjectDescription: new FormControl(null, [
        Validators.required,
        Validators.maxLength(150)
      ]),
      ProjectCompany: new FormControl(null, [
        Validators.required,
        Validators.maxLength(150)
      ]),
      ProjectLeader: new FormControl(null, Validators.required),
      ClientProjectCoordinator: new FormControl(10, Validators.required),
      CreatedBy: new FormControl(this._cookieService.get('Oid')),
      Status: new FormControl('A', Validators.required),
    });
  }

  updateDropdown() {
    this.usersList = this.allUsers.filter(x =>
      x.IsClient === false);
    this.clientUsersList = this.allUsers.filter(x =>
      x.CompanyID.toString() === this.createProjectForm.get('ProjectCompany').value.toString());
  }

  createProject() {
    // console.log(this.createProjectForm.value);
    this.url = 'Project/PostProject';

    this.engineService.postData(this.url, this.createProjectForm.value).then(response => {
      if (response.status === 201 || response.status === 200) {
        this.alertService.success('Project successfully created!');
        this.router.navigate(['dashboard/project']);
      }
    }).catch(error => {
      this.alertService.danger('Project creation failed!' + error);
    });
  }
}
