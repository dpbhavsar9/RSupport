import { Component, Inject, OnInit } from '@angular/core';
import { EngineService } from '../../../services/engine.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { CookieService } from 'ngx-cookie';

// tslint:disable-next-line:max-line-length
@Component({ selector: 'app-edit-user-dialog', templateUrl: './edit-user-dialog.component.html', styleUrls: ['./edit-user-dialog.component.scss'] })

export class EditUserDialogComponent implements OnInit {

  url: any;
  statusList = [
    { value: 'A', viewValue: 'Active' },
    { value: 'C', viewValue: 'Inactive' }
  ];
  companies = [];
  // tslint:disable-next-line:max-line-length
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private engineService: EngineService,
    private alertService: AlertService,
    private _cookieService: CookieService) { }

  editUserForm: FormGroup;

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

    this.editUserForm = new FormGroup({
      Oid: new FormControl(this.data.Oid, [Validators.required]),
      UserName: new FormControl(this.data.UserName, [Validators.required]),
      MobileNo: new FormControl(this.data.MobileNo, [Validators.required]),
      Email: new FormControl(this.data.Email, [Validators.required]),
      Department: new FormControl(this.data.Department),
      UserCompany: new FormControl(this.data.UserCompany),
      UserCompanyName: new FormControl(this.data.UserCompanyName),
      Designation: new FormControl(this.data.Designation),
      Status: new FormControl(this.data.Status),
      UpdatedBy: new FormControl(this._cookieService.get('Oid'))
    });
  }

  updateUser() {
    this.engineService.validateUser();
    // console.log(this.editUserForm.value);
    if (this.editUserForm.status === 'VALID') {

      this.url = 'Users/PutUser';
      this.engineService.updateData(this.url, this.editUserForm.value).then(response => {
        if (response.status === 201 || response.status === 200) {
          this.alertService.success('User successfully updated!');
          this
            .dialogRef
            .close();
          //  // console.log('upd');
        } else {
          return this.alertService.warning(response.status);
        }
      }).catch(error => {
        return this.alertService.danger('User update failed! (' + error.statusText + ')');
      });
    }
  }

  onNoClick(): void {
    this
      .dialogRef
      .close();
  }

}
