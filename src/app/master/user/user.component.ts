import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { AlertService } from 'ngx-alerts';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EditUserDialogComponent } from '../modal/edit-user-dialog/edit-user-dialog.component';


@Component({ selector: 'app-user', templateUrl: './user.component.html', styleUrls: ['./user.component.scss'] })
export class UserComponent implements OnInit, OnDestroy {


  // userMasterSubscription: Subscription;
  private timerSubscription: Subscription;
  public radioModel = 'Desktop';
  val = '';
  url: any;
  rows = [];
  temp = [];
  selected = [];
  initialLength = 0;
  updatedLength = 0;
  firstSelectScrollFlag = true;
  editing = {};
  loadingIndicator = true;
  columns = [
    {
      prop: 'UserName',
      name: 'UserName'
    }, {
      prop: 'MobileNo',
      name: 'MobileNo'
    }, {
      prop: 'Email',
      name: 'Email'
    }, {
      prop: 'Department',
      name: 'Department'
    }, {
      prop: 'UserCompanyName',
      name: 'Company'
    }, {
      prop: 'Designation',
      name: 'Designation'
    }, {
      prop: 'Status',
      name: 'Status'
    }
  ];
  userRole: string;

  // tslint:disable-next-line:max-line-length
  constructor(private engineService: EngineService, private alertService: AlertService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    setTimeout(() => { this.loadingIndicator = false; }, 1500);
    this.refreshData();
    this.userRole = this.engineService.userRole;
  }

  private subscribeToData(): void {

    this.timerSubscription = timer(5 * 60 * 1000)
      .subscribe(() => {
        this.refreshData();
      });
  }


  private refreshData(): void {
    // console.log('user master refreshed');
    // this.userMasterSubscription =
    // setTimeout(() => {
    this.url = 'Users/GetUsers';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        this.updateUsers(res);
        this.subscribeToData();
        this.updateFilter();
      }).catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error @refreshData');
      });
    // }, 0);
  }

  private onClear(): void {
    this.val = '';
    this.updateFilter();
  }

  public exportExcel(): void {
    this.engineService.downloadExcel(this.rows, 'User Master');
  }

  public updateFilter() {

    const val = this.val.toLocaleLowerCase().trim();
    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.UserName.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else if (d.MobileNo.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else if (d.Email.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else if (d.Department.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else if (d.Designation.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else {
        return false;
      }
    });

    // update the rows
    this.rows = temp;
    this.updatedLength = temp.length;
  }

  private updateUsers(users: any) {
    this.rows = users;
    this.temp = [...this.rows];
    this.initialLength = this.temp.length;
    this.updatedLength = this.temp.length;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private createUser() {
    // // console.log('createUser:' + this.router.url);
    this.router.navigate(['dashboard/user/create-user']);

  }

  private editRow(row) {

    // // console.log(row);
    const dialogRef = this
      .dialog
      .open(EditUserDialogComponent, {
        minWidth: '60%',
        maxWidth: '95%',
        panelClass: 'editDialog',
        data: row,
        hasBackdrop: true,
        closeOnNavigation: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this.refreshData();
      });
  }

  private deleteRow() {

    if (confirm('Delete')) {
      // this.engineService.deleteUser(deleteNum);
      this
        .alertService
        .danger('Deleted Successfully!');

    } else {
      // console.log('Cancel');
      this
        .alertService
        .info('Operation Cancelled!');
    }
  }

  private deleteSelected() {

    if (confirm('Delete')) {
      const deleteNum: Array<any> = [];

      // tslint:disable-next-line:forin
      for (const i in this.selected) {
        deleteNum.push(this.selected[i].Oid);
        // console.log('-------------', this.selected[i].Oid);
      }
      this.engineService.deleteUser(deleteNum)
        .then(res => {
          // console.log(res);
        }).catch();
      this
        .alertService
        .danger('Deleted Successfully!');

    } else {
      // console.log('Cancel');
      this
        .alertService
        .info('Operation Cancelled!');
    }
  }

  private onSelect({ selected }) {
    // console.log('Select Event', selected, this.selected);
    if (this.firstSelectScrollFlag) {
      // this.alertService.info('Scroll down to see selection');
      this.firstSelectScrollFlag = !this.firstSelectScrollFlag;
    }
    this
      .selected
      .splice(0, this.selected.length);
    this
      .selected
      .push(...selected);
    // return this.alertService.info(selected[selected.length-1].UserName+ ' added
    // to Selection');

  }

  private onActivate(event) {
    // // console.log('Activate Event', event);
  }

  private displayCheck(row) {
    return row.name !== 'Ethel Price';
  }
}
