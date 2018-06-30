import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EngineService } from '../../services/engine.service';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { EditTeamComponent } from '../modal/edit-team/edit-team.component';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  private timerSubscription: Subscription;
  url: any;
  hoveredRow: any[] = [];
  selected: any = {
    '$id': '1',
    'Oid': 4,
    'ProjectID': 4,
    'ProjectName': 'Project 1',
    'TeamLeader': 9,
    'TeamLeaderName': 'DARSHAN',
    'CompanyID': 7,
    'CompanyName': 'Raj Barcode Systems Pvt. Ltd. ',
    'Status': 'A',
    'TeamName': 'T23',
    'TeamMembers': [
      {
        '$id': '15',
        'UserID': 9,
        'UserRole': 'Administrator',
        'UserName': 'DARSHAN',
        'Status': 'A'
      },

      { '$id': '16', 'UserID': 14, 'UserRole': 'Manager', 'UserName': 'NEMIL', 'Status': 'A' },
      { '$id': '17', 'UserID': 15, 'UserRole': 'User', 'UserName': 'JAGUL', 'Status': 'A' }
    ],
    'Open': '0',
    'WIP': '0',
    'Hold': '0',
    'Close': '0',
    'Cancel': '0',
    'Dump': '0'
  };
  val = '';
  temp: any[];
  initialLength = 0;
  updatedLength = 0;
  rows: any[];
  loadingIndicator = true;
  columns = [
    {
      prop: 'CompanyID',
      name: 'ID'
    }, {
      prop: 'CompanyName',
      name: 'Company'
    }, {
      prop: 'IsClient',
      name: 'Client'
    }, {
      prop: 'Add1',
      name: 'Address Line 1'
    }, {
      prop: 'Add2',
      name: 'Line 2'
    }, {
      prop: 'Add3',
      name: 'Line 3'
    }, {
      prop: 'City',
      name: 'City'
    }, {
      prop: 'State',
      name: 'State'
    }, {
      prop: 'Pincode',
      name: 'Pincode'
    }, {
      prop: 'Country',
      name: 'Country'
    }, {
      prop: 'LandLineNo',
      name: 'LandLineNo'
    }, {
      prop: 'Status',
      name: 'Status'
    }
  ];
  public radioModel = 'Desktop';

  public chartType = 'pie';

  public chartData: any[] = [this.selected.Open, this.selected.WIP, this.selected.Hold, this.selected.Close, this.selected.Cancel];

  public chartLabels: any[] = ['Open', 'WIP', 'Hold', 'Close', 'Cancel', 'Dump'];

  public chartColors: any[] = [{
    // tslint:disable-next-line:max-line-length
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 1,
    backgroundColor: ['#9fa8da', '#1976d2', '#ffff00', '#76ff03', '#8d8d8d', '#8d8d8d'],
    hoverBackgroundColor: ['#12005e', '#12005e', '#12005e', '#12005e', '#12005e', '#12005e']
  }];

  public chartOptions: any = {
    responsive: true
  };
  userRole: string;

  // tslint:disable-next-line:max-line-length
  constructor(private engineService: EngineService, private alertService: AlertService, private router: Router, public dialog: MatDialog) { }

   ngOnInit() {
    this.refreshData();
    this.userRole = this.engineService.userRole;
  }

  public exportExcel(): void {
    this.engineService.downloadExcel(this.rows, 'Company_Master');
  }

  private subscribeToData(): void {

    this.timerSubscription = timer(5 * 60 * 1000)
      .subscribe(() => {
        this.refreshData();
      });
  }

  public updateFilter() {
    const val = this.val.toLocaleLowerCase().trim();

    // filter our rows
    const temp = this.temp.filter(function (d) {
      if (d.TeamName.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else {
        return false;
      }
    });

    // update the rows
    this.rows = temp;
    this.updatedLength = temp.length;
  }

  private updateTeam(companies: any) {
    this.rows = companies;
    this.temp = [...this.rows];
    this.initialLength = this.temp.length;
    this.updatedLength = this.temp.length;
    this.loadingIndicator = false;
  }

  private onClear(): void {
    this.val = '';
    this.updateFilter();
  }

  private refreshData(): void {
    // console.log('user master refreshed');
    this.url = 'Team/GetTeamsForView';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(JSON.stringify(res));
        this.updateTeam(res);
        this.subscribeToData();
        this.updateFilter();
      }).catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error @refreshData');
      });
  }

  private getDataForModal(row) {
    // console.log(row);
    this.selected = row;
    // tslint:disable-next-line:max-line-length
    this.chartData = [this.selected.Open, this.selected.WIP, this.selected.Hold, this.selected.Close, this.selected.Cancel, this.selected.Dump];
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  private onActivate(event) {
    this.hoveredRow = event.row.TeamMembers;
  }

  private onSelect({ selected }) {
    // console.log(selected);
  }

  public editRow(row) {
    // // console.log(row);
    const dialogRef = this
      .dialog
      .open(EditTeamComponent, {
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
        // // console.log('The dialog was closed');
        this.refreshData();
      });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
