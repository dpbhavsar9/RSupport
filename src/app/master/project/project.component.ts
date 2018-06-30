import { Component, OnInit, OnDestroy } from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { EditProjectComponent } from '../modal/edit-project/edit-project.component';
import { timer } from 'rxjs/internal/observable/timer';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  url: any;
  private timerSubscription: Subscription;
  selected = {
    'ProjectName': '',
    'ProjectID': '',
    'ProjectDescription': '',
    'ProjectLeaderName': '',
    'ClientProjectCoordinatorName': '',
    'Status': '',
    'Open': '',
    'WIP': '',
    'Close': ''
  };
  val = '';
  temp: any[];
  initialLength = 0;
  updatedLength = 0;
  rows: any[];
  loadingIndicator = true;
  columns = [
    {
      prop: 'ProjectName',
      name: 'Project'
    }, {
      prop: 'CompanyName',
      name: 'Company'
    }, {
      prop: 'ProjectLeaderName',
      name: 'Project Leader'
    }, {
      prop: 'ProjectDescription',
      name: 'Description'
    }, {
      prop: 'ClientProjectCoordinatorName',
      name: 'Client Project Co-ordinator'
    }, {
      prop: 'Status',
      name: 'Status'
    }
  ];
  public radioModel = 'Desktop';

  public chartType = 'pie';

  public chartData: any[] = [this.selected.Open, this.selected.WIP, this.selected.Close];

  public chartLabels: any[] = ['Open', 'WIP', 'Closed'];

  public chartColors: any[] = [{
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 1,
    backgroundColor: ['#ef5350', '#03A9F4', '#4CAF50'],
    hoverBackgroundColor: ['#E91E63', '#E91E63', '#E91E63']
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
    // console.log(this.userRole);
  }

  public exportExcel(): void {
    this.engineService.downloadExcel(this.rows, 'Project Master');
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
      if (d.ProjectName.toLowerCase().indexOf(val) !== -1 || !val) {
        return true;
      } else {
        return false;
      }
    });
    // update the rows
    this.rows = temp;
    this.updatedLength = temp.length;
  }

  private updateProjects(projects: any) {
    this.rows = projects;
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
    // console.log('Project master refreshed');

    this.url = 'Project/GetProject';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        this.updateProjects(res);
        this.subscribeToData();
        this.updateFilter();
      }).catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error @refreshData');
      });
  }

  private getDataForModal(prj) {
    // console.log(prj);
    this.selected = prj;
    this.chartData = [this.selected.Open, this.selected.WIP, this.selected.Close];
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  private onActivate(event) {
    // // console.log('Activate Event', event);
  }

  private onSelect({ selected }) {
    // // console.log(selected);
  }

  public editRow(row) {
    // console.log(row);
    const dialogRef = this
      .dialog
      .open(EditProjectComponent, {
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
