import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from 'ngx-alerts';
import { EngineService } from '../../../services/engine.service';
import { NullTemplateVisitor } from '@angular/compiler';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  url: any;
  private sub: any;
  projectData: any;
  editProjectForm: FormGroup;
  allUsers: any[];
  usersList: any[];
  clientUsersList: any[];
  companyList: any[];

  status = [
    { value: 'A', viewValue: 'Active' },
    { value: 'C', viewValue: 'Inactive' }
  ];

  constructor(
    private alertService: AlertService,
    public dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private engineService: EngineService,
    private _cookieService: CookieService) { }

  ngOnInit() {
    this.prepareForm();
    this.getServerData();
  }

  private prepareForm() {

    this.editProjectForm = new FormGroup({
      'Oid': new FormControl(this.data.Oid),
      'ProjectID': new FormControl(this.data.ProjectID),
      'ProjectName': new FormControl(this.data.ProjectName, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150)
      ]),
      'ProjectDescription': new FormControl(this.data.ProjectDescription, [
        Validators.required,
        Validators.maxLength(150)
      ]),
      'ProjectCompany': new FormControl(this.data.ProjectCompany, [
        Validators.required,
        Validators.maxLength(150)
      ]),
      'ProjectLeader': new FormControl(this.data.ProjectLeader, Validators.required),
      'ClientProjectCoordinator': new FormControl(this.data.ClientProjectCoordinator, Validators.required),
      'CreatedBy': new FormControl(this._cookieService.get('Oid')),
      'Status': new FormControl(this.data.Status, Validators.required),
    });

  }

  getServerData() {
    // User Dropdown - start
    this.url = 'Users/GetAllUser';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        this.allUsers = res;
        this.updateDropdown();
      }).catch(err => {
        this.alertService.danger('Server response error! @getServerData');
      });
    // User Dropdown - end

    // Company Dropdown - start
    this.url = 'Company/GetAllCompany';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.companyList = res;
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error!');
      });
    // Company Dropdown - end
  }

  updateDropdown() {
    this.usersList = this.allUsers.filter(x =>
      x.IsClient === false);
    this.clientUsersList = this.allUsers.filter(x =>
      x.CompanyID.toString() === this.editProjectForm.get('ProjectCompany').value.toString());
  }

  private updateForm() {
    this.editProjectForm.setValue({
      'ProjectID': this.projectData.ProjectID,
      'ProjectName': this.projectData.ProjectName,
      'ProjectDescription': this.projectData.ProjectDescription,
      'ProjectCompany': this.projectData.ProjectCompany,
      'ProjectLeader': this.projectData.ProjectLeader,
      'ClientProjectCoordinator': this.projectData.ClientProjectCoordinator,
      'ClientProjectCoordinatorName': this.projectData.ClientProjectCoordinatorName,
      'CreatedBy': this._cookieService.get('Oid'),
      'Status': this.projectData.Status
    });
  }


  updateProject() {
    this.engineService.validateUser();
    this.url = 'Project/PutProject';
    this.engineService.updateData(this.url, this.editProjectForm.value).then(response => {
      if (response.status === 201 || response.status === 200) {
        this.alertService.success('Project successfully updated!');
        this
          .dialogRef
          .close();
      }
    }).catch(error => {
      this.alertService.danger('Project creation failed!');
    });
  }

  onNoClick(): void {
    this
      .dialogRef
      .close();
  }

}
