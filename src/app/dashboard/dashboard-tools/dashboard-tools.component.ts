import { Component, OnInit, OnDestroy } from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { CookieService } from 'ngx-cookie';
import { AlertService } from 'ngx-alerts';
import { MatDialog } from '@angular/material';
import { AlertComponent } from '../../master/modal/alert/alert.component';
import * as crypto from 'crypto-js';
import { DashboardComponent } from '../dashboard.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { timer } from 'rxjs/internal/observable/timer';
import { Observable } from 'rxjs/internal/Observable';
import { MeslogComponent } from '../../transaction/meslog/meslog.component';


@Component({
  selector: 'app-dashboard-tools',
  templateUrl: './dashboard-tools.component.html',
  styleUrls: ['./dashboard-tools.component.scss']
})
export class DashboardToolsComponent implements OnInit, OnDestroy {

  url: string;
  selected = 'Open';
  ticketLogTypeSelector = 'WIP';
  data: any[] = [{ 'TicketStatus': 'Open', 'Count': 0 },
  { 'TicketStatus': 'WIP', 'Count': 0 },
  { 'TicketStatus': 'Hold', 'Count': 0 },
  { 'TicketStatus': 'Close', 'Count': 0 },
  { 'TicketStatus': 'Cancel', 'Count': 0 }
  ];
  manualUpdateFlag = false;
  source: any[] = [{
    'status': 'Open',
    'data': []
  }, {
    'status': 'WIP',
    'data': []
  }, {
    'status': 'Hold',
    'data': []
  }, {
    'status': 'Close',
    'data': []
  }, {
    'status': 'Cancel',
    'data': []
    }];

  collpaseArray: any[] = [];
  isCollapsed = true;
  private timerSubscription: Subscription;
  subscription: Subscription;
  private toggle = 'none';
  dashboardState: string = this.dashboardComponent.dashboardState;
  userRole: string;
  userName: string;
  val = '';
  valSort = '';
  ascSort = 'true';
  rows: any[] = [];
  temp: any[] = [];
  Oid: string;
  allocationType = 'Team';
  searchIn = 'Multiple';
  condensedView = false;

  constructor(private engineService: EngineService,
    // tslint:disable-next-line:max-line-length
    private _cookieService: CookieService, private alertService: AlertService, public dialog: MatDialog, private dashboardComponent: DashboardComponent) {
    const cookieData = crypto.AES.decrypt(this._cookieService.get('response'), this._cookieService.get('Oid') + 'India');
    this.Oid = JSON.parse(cookieData.toString(crypto.enc.Utf8)).Oid;
    this.userName = JSON.parse(cookieData.toString(crypto.enc.Utf8)).UserName;
  }

  public updateFilter() {
    const userName = this.userName;
    const allocationType = this.allocationType;
    const val = this.val.toLocaleLowerCase();
    const searchIn = this.searchIn;
    let res = this.temp;

    res = res.filter(function (d) {
      if (allocationType === 'OnlyMe' && d.AssignToName.toLocaleLowerCase() === userName.toLocaleLowerCase()) {
        return true;
      } else if (allocationType === 'ExceptMe' && d.AssignToName.toLocaleLowerCase() !== userName.toLocaleLowerCase()) {
        return true;
      } else if (allocationType === 'Team') {
        return true;
      } else {
        return false;
      }
    });

    res = res.filter(function (d) {
      if (searchIn === 'Multiple') {
        if (d.Subject.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.TicketNo.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.TicketDescription.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.TeamName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.ProjectName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CompanyName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.Priority.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.AssignByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.AssignToName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CancelByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CloseByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.CreatedByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.HoldByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else if (d.WIPByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'TicketNo') {
        if (d.TicketNo.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'TicketDescription') {
        if (d.TicketDescription.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'TeamName') {
        if (d.TeamName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'ProjectName') {
        if (d.ProjectName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'CompanyName') {
        if (d.CompanyName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'Priority') {
        if (d.Priority.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'AssignByName') {
        if (d.AssignByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'AssignToName') {
        if (d.AssignToName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'CancelByName') {
        if (d.CancelByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'CloseByName') {
        if (d.CloseByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'CreatedByName') {
        if (d.CreatedByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'HoldByName') {
        if (d.HoldByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      } else if (searchIn === 'WIPByName') {
        if (d.WIPByName.toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        } else {
          return false;
        }
      }
    });

    res = res.sort((a, b) => {
      switch (this.valSort) {
        case 'TicketNo':
          if (this.ascSort === 'true') {
            if (a.TicketNo < b.TicketNo) {
              return -1;
            } else if (a.TicketNo > b.TicketNo) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.TicketNo < b.TicketNo) {
              return 1;
            } else if (a.TicketNo > b.TicketNo) {
              return -1;
            } else {
              return 0;
            }

          }
        case 'Priority':
          if (this.ascSort === 'true') {
            if (a.Priority < b.Priority) {
              return -1;
            } else if (a.Priority > b.Priority) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.Priority < b.Priority) {
              return 1;
            } else if (a.Priority > b.Priority) {
              return -1;
            } else {
              return 0;
            }
          }
        case 'Subject':
          if (this.ascSort === 'true') {
            if (a.Subject < b.Subject) {
              return -1;
            } else if (a.Subject > b.Subject) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.Subject < b.Subject) {
              return 1;
            } else if (a.Subject > b.Subject) {
              return -1;
            } else {
              return 0;
            }
          }

        case 'TicketDescription':
          if (this.ascSort === 'true') {
            if (a.TicketDescription < b.TicketDescription) {
              return -1;
            } else if (a.TicketDescription > b.TicketDescription) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.TicketDescription < b.TicketDescription) {
              return 1;
            } else if (a.TicketDescription > b.TicketDescription) {
              return -1;
            } else {
              return 0;
            }
          }

        case 'CreatedDate':
          if (this.ascSort === 'true') {
            if (a.CreatedDate < b.CreatedDate) {
              return -1;
            } else if (a.CreatedDate > b.CreatedDate) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (a.CreatedDate < b.CreatedDate) {
              return 1;
            } else if (a.CreatedDate > b.CreatedDate) {
              return -1;
            } else {
              return 0;
            }
          }


        default:
          // console.log('6');
          if (a.CreatedDate < b.CreatedDate) {
            return -1;
          } else if (a.CreatedDate > b.CreatedDate) {
            return 1;
          } else {
            return 0;
          }
      }
    });

    // update the rows
    this.source[0].data = res.filter(x => x.TicketStatus === 1);
    this.source[1].data = res.filter(x => x.TicketStatus === 2);
    this.source[2].data = res.filter(x => x.TicketStatus === 3);
    this.source[3].data = res.filter(x => x.TicketStatus === 4);
    this.source[4].data = res.filter(x => x.TicketStatus === 5);
    this.data[0].Count = this.source[0].data.length;
    this.data[1].Count = this.source[1].data.length;
    this.data[2].Count = this.source[2].data.length;
    this.data[3].Count = this.source[3].data.length;
    this.data[4].Count = this.source[4].data.length;
  }

  updateTickets(tickets: any) {
    // console.log(tickets);
    this.rows = tickets;
    this.temp = tickets;
    // update the rows
    this.source[0].data = this.temp.filter(x => x.TicketStatus === 1);
    this.source[1].data = this.temp.filter(x => x.TicketStatus === 2);
    this.source[2].data = this.temp.filter(x => x.TicketStatus === 3);
    this.source[3].data = this.temp.filter(x => x.TicketStatus === 4);
    this.source[4].data = this.temp.filter(x => x.TicketStatus === 5);
    this.data[0].Count = this.source[0].data.length;
    this.data[1].Count = this.source[1].data.length;
    this.data[2].Count = this.source[2].data.length;
    this.data[3].Count = this.source[3].data.length;
    this.data[4].Count = this.source[4].data.length;
  }

  updateTicketLogTypeSelector(id: number) {
    this.ticketLogTypeSelector = this.data[id].TicketStatus;
  }

  ngOnInit() {
    this.dashboardComponent.cloneDashboardState = this.dashboardState;
    this.Oid = this._cookieService.get('Oid');
    const Decrypt = crypto.AES.decrypt(this._cookieService.get('response').toString(), this.Oid + 'India');
    const decryptData = Decrypt.toString(crypto.enc.Utf8);
    this.userRole = JSON.parse(decryptData).UserRole;
    this.userName = JSON.parse(decryptData).UserName;
    if (this.userRole !== 'Administrator') {
      this.refreshData();
      this.subscription = this.engineService.getDashboardState().subscribe(dashboardState => {
        this.dashboardState = dashboardState.dashboardState.toString();
        this.refreshData();
      });
    }
  }

  private subscribeToData(): void {
    const timerVar = timer(2 * 60 * 1000);
    this.timerSubscription = timerVar.subscribe(() => {
      this.refreshData();
    });
  }

  private refreshData(): void {

    if (this.dashboardState === 'byme') {
      this.url = 'Ticket/GetMyTickets/' + this._cookieService.get('Oid');
    } else if (this.dashboardState === 'mytickets') {
      this.url = 'Ticket/GetTeamTickets/' + this._cookieService.get('Oid');
    }
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.updateTickets(res);
        this.updateFilter();
        if (!this.manualUpdateFlag) {
          this.subscribeToData();
        }
        this.manualUpdateFlag = false;
      }).catch(err => {
        this.alertService.danger('Server response error @refreshData');
      });
  }

  private selectRow(row) {
    this.val = row.TicketNo;
    this.searchIn = 'TicketNo';
    this.condensedView = false;
    this.updateFilter();
  }

  public clearSerchCriteria() {
    this.condensedView = false;
    this.val = '';
    this.searchIn = 'Multiple';
    this.updateFilter();
  }

  private openTicketMessage(index, pindex) {

    const row = this.source[index].data[pindex];

    const data = {
      'CompanyID': row['CompanyID'],
      'ProjectID': row['ProjectID'],
      'TicketID': row['Oid'],
      'TicketNo': row['TicketNo'],
      'TicketStatus': row['TicketStatus'],
    };

    const dialogRef = this
      .dialog
      .open(MeslogComponent, {
        height: '80%',
        maxHeight: '80%',
        width: '80%',
        panelClass: 'ticketDialog',
        data: data,
        hasBackdrop: true,
        closeOnNavigation: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
      });
  }

  processTicket(id, status) {
    let data;
    let message;
    const by = this._cookieService.get('Oid');
    switch (status) {

      case 1: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Re-open ticket?';
        break;
      }
      case 2: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Take this ticket?';
        break;
      }
      case 3: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Put on Hold?';
        break;
      }
      case 4: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Close this Ticket?';
        break;
      }
      case 5: {
        data = { Oid: id, TicketStatus: status, By: by };
        message = 'Cancel this Ticket?';
        break;
      }
      default:
    }

    this.commonDialog(message).subscribe(res => {
      if (res === 'Yes') {
        this.url = 'Ticket/ChangeStatus';
        this.engineService.updateData(this.url, data).then(result => {
          this.manualUpdateFlag = true;
          this.refreshData();
        });
      }
    });

  }

  commonDialog(message): Observable<any> {

    const dialogRef = this.dialog.open(AlertComponent, {
      height: 'auto',
      width: 'auto',
      minWidth: '300px',
      data: message,
      panelClass: 'ticketDialog',
      hasBackdrop: true,
      closeOnNavigation: true
    });

    return dialogRef.afterClosed();
  }

  ngOnDestroy() {
    if (this.userRole !== 'Administrator') {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.subscription.unsubscribe();
    }
    this.dashboardComponent.cloneDashboardState = 'none';
  }
}
