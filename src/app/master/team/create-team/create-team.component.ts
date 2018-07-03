import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../../services/engine.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {

  url: any;
  createTeamForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  userList: any[] = [];
  statusList = [
    { value: 'A', viewValue: 'Active' },
    { value: 'C', viewValue: 'Inactive' }
  ];
  userRoles = [
    { value: 'Administrator', viewValue: 'Administrator' },
    { value: 'Manager', viewValue: 'Manager' },
    { value: 'User', viewValue: 'User' }
  ];
  usersDataSource = [];
  selectedUsers = [];
  finalUsersList = [];


  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService, private router: Router, private engineService: EngineService, private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompanies();

  }

  prepareForm() {
    this.createTeamForm = new FormGroup({
      TeamName: new FormControl(null, Validators.required),
      CompanyID: new FormControl(null, Validators.required),
      ProjectID: new FormControl(null, Validators.required),
      TeamLeader: new FormControl(null, Validators.required),
      Users: new FormControl(null, Validators.required),
      UsersForTeamWithRoles: new FormControl(null, Validators.required),
      TeamMemberList: new FormControl(null),
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
    const company = this.createTeamForm.get('CompanyID').value;
    // console.log(company);
    // Company Dropdown - start
    this.url = 'Project/GetProject/' + company;
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

  loadUsers() {
    this.url = 'Users/GetAllUser';
    this.engineService.getData(this.url).toPromise().then((res => {
      // console.log(res);
      this.userList = res.filter(x => x.IsClient === false);
    })).catch(err => {
      this.alertService.danger('Server response error! @loadUsers');
    });
  }

  createTeam() {
    this.engineService.validateUser();
    if (this.createTeamForm.status === 'VALID') {

      this.url = 'Team/PostTeam';
      this.engineService.postData(this.url, this.createTeamForm.value).then(response => {
        if (response.status === 201) {
          this.alertService.success('Team successfully created!');
          this.router.navigate(['dashboard']);
        }
      }).catch(error => {
        // console.log(this.createTeamForm.value);
        this.alertService.danger('Team creation failed!');
      });
    }
  }

  addUser() {
    this.usersDataSource.push({ UserID: '', UserRole: '' });
  }

  removeUser(index) {
    // console.log(index);
    this.usersDataSource.splice(index, 1);
    // console.log(this.usersDataSource);
  }

  onUserSelected() {

    this.selectedUsers = this.createTeamForm.get('Users').value;

    for (let i = 0; i < this.finalUsersList.length; i++) {
      const e1 = this.finalUsersList[i].Oid;
      let toDelete = true;
      for (let j = 0; j < this.selectedUsers.length; j++) {
        const e2 = this.selectedUsers[j].Oid;
        if (e2 === e1) {
          toDelete = false;
          // break;
        }
      }
      if (toDelete === true) {
        this.finalUsersList.splice(i, 1);
      }
    }
    // // console.log('onUserSelected - selectedUsers', this.selectedUsers);
    // // console.log('onUserSelected - finalUsersList', this.finalUsersList);
  }

  onUserRoleSelected() {

    let addFlag = true;
    for (let i = 0; i < this.finalUsersList.length; i++) {
      const element = this.finalUsersList[i].UserID;
      if (element === this.createTeamForm.get('UsersForTeamWithRoles').value.Oid) {
        addFlag = false;
        this.finalUsersList.splice(i, 1);
        this.finalUsersList.push(this.createTeamForm.get('UsersForTeamWithRoles').value);
      }
    }
    if (addFlag === true) {
      this.finalUsersList.push(this.createTeamForm.get('UsersForTeamWithRoles').value);
    }
    this.createTeamForm.patchValue({
      TeamMemberList: this.finalUsersList
    });
    // // console.log('onUserRoleSelected - selectedUsers', this.selectedUsers);
    // // console.log('onUserRoleSelected - finalUsersList', this.finalUsersList);

  }

}
