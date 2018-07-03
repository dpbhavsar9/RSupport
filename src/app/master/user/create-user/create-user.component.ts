import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../../services/engine.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  createUserForm: FormGroup;
  selectedUserRole: string;
  url: any;

  config = {
    displayKey: 'viewValue',
    // if objects array passed which key to be displayed defaults to description,
    search: false, // enables the search plugin to search in the list
    value: this.selectedUserRole,
  };

  userRoles = [
    { value: 'Administrator', viewValue: 'Administrator' },
    { value: 'Manager', viewValue: 'Manager' },
    { value: 'User', viewValue: 'User' }
  ];
  companies = [];

  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService, private router: Router, private engineService: EngineService, private _cookieService: CookieService) { }

  ngOnInit() {

    this.url = 'Company/GetCompany';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        for (let i = 0; i < res.length; i++) {
          this.companies.push({ value: res[i].Oid, viewValue: res[i].CompanyName });
        }
      }).catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error @refreshData');
      });
    this.createUserForm = new FormGroup({

      UserName: new FormControl(null, [
        Validators.required,
        // Validators.minLength(6)
      ]),
      Password: new FormControl(null, [
        Validators.required,
        // Validators.minLength(6),
        // Validators.maxLength(12)
      ]),
      ConfirmPassword: new FormControl(null, [
        Validators.required,
        // Validators.minLength(6),
        // Validators.maxLength(12)
      ]),
      Email: new FormControl(null, [Validators.required, Validators.email]),
      MobileNo: new FormControl(null, Validators.required),
      Department: new FormControl(null, Validators.required),
      UserRole: new FormControl(null, Validators.required),
      Designation: new FormControl(null, Validators.required),
      UserCompany: new FormControl(null, Validators.required),
      LandLineNo: new FormControl(null),
      CreatedBy: new FormControl(this._cookieService.get('Oid'))
    });
  }

  createUser() {
    this.engineService.validateUser();
    if (this.createUserForm.status === 'VALID') {
      if (this.createUserForm.get('Password').value !== this.createUserForm.get('ConfirmPassword').value) {
        return this.alertService.danger('Password and Confirm Password not matched!');
      }

      this.url = 'Users/PostUser';
      this.engineService.postData(this.url, this.createUserForm.value).then(response => {
        if (response.status === 201) {
          this.alertService.success('User successfully created!');
          this.router.navigate(['dashboard/user']);
        }
      }).catch(error => {
        this.alertService.danger('User creation failed!');
      });
    }
  }


  check() {

    if (this.createUserForm.get('Password').value !== this.createUserForm.get('ConfirmPassword').value) {
      return this.alertService.danger('Password and Confirm Password not matched!');
    }
  }
}
