import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../services/engine.service';
import { CookieService } from 'ngx-cookie';
import { UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {

  checkfilesuccess: boolean = false;
  checkfilefail: boolean = false;
  filenamesuccess: Array<{ name: string }> = [];
  filenamefail: Array<{ name: string }> = [];

  dfiles = [];
  url: any;
  createTicketForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  allTicketTypeList: any[] = [];
  ticketTypeList: any[] = [];
  teamList: any[] = [];
  assignToUserList: any[];
  fileToUpload: File = null;
  // tslint:disable-next-line:max-line-length
  priorityList: any[] = [{ value: 'High', viewValue: 'High' }, { value: 'Medium', viewValue: 'Medium' }, { value: 'Low', viewValue: 'Low' }];
  data = {
    TicketID: '',
    TicketNo: '',
    TicketBacklogID: ''
  };
  ticketSaved = false;
  files: UploadFile[] = [];

  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService,
    
    private engineService: EngineService,
   
    private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompany();
    // this.loadAssignTo();
    this.loadTicketType();
    // this.loadTeams();
  }

  prepareForm() {
    this.createTicketForm = new FormGroup({

      CompanyID: new FormControl(null, Validators.required),
      ProjectID: new FormControl(null, Validators.required),
      TicketType: new FormControl(null, Validators.required),
      Priority: new FormControl(null, Validators.required),
      Subject: new FormControl(null, Validators.required),
      TicketDescription: new FormControl(null, Validators.required),
      TeamID: new FormControl(null, Validators.required),
      AssignTo: new FormControl(null),
      CreatedBy: new FormControl(this._cookieService.get('Oid'))
    });
  }

  loadCompany() {
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
    const CompanyID = this.createTicketForm.get('CompanyID').value;
    // // console.log(CompanyID);
    // Company Dropdown - start
    this.url = 'Project/GetProject';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.projectList = res.filter(data => data.ProjectCompany === CompanyID);
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadCompany');
      });
    // Company Dropdown - end
  }

  loadTeams() {
    const ProjectID = this.createTicketForm.get('ProjectID').value;
    this.url = 'Team/GetTeamProject/' + ProjectID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        this.teamList = res.filter(data => data.ProjectID === ProjectID);
      })
      .catch(err => {
        this.alertService.danger('Server response error! @loadTeam');
      });
  }



  loadTeamMembers() {
    const TeamID = this.createTicketForm.get('TeamID').value;
    this.url = 'Users/GetTeamMembers/' + TeamID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.assignToUserList = res;
      })
      .catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error!');
      });
  }

  loadTicketType() {
    // TicketType Dropdown - start
    this.url = 'Ticket/GetTicketType';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.allTicketTypeList = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });
    // TicketType Dropdown - end
  }

  /* dropped(event: UploadEvent) {

    this.files = event.files;

    for (const droppedFile of event.files) {
      
      if (droppedFile.fileEntry.isFile) {

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
         fileEntry.file(async (file: File) => {
          this.fileToUpload = file;
          const filename = file.name;
          let res = await this.uploadFileToActivity(filename);
          console.log("------Dropped-------")
        });

      } else {

        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;

      }
    }
  }*/

  async handleFileInput(files: FileList) {

    for (let i = 0; i < files.length; i++) {
      const fileItem = files.item(i);
      this.fileToUpload = fileItem;
      const filename = fileItem.name;


      let res = await this.uploadFileToActivity(filename);
      //console.log("--------handlefile2--------" + res)
    }
  }


  async uploadFileToActivity(filename): Promise<any> {

    //console.log("------upload file activity method calling---------")
    this.filenamesuccess.length = 0;
    this.filenamefail.length = 0;
    
     this.engineService.uploadFile(this.fileToUpload, this.data, filename).then(res => {
      //console.log('----- File Upload -----' + JSON.stringify(res));
      if (JSON.stringify(res) === '"Success"') {
        this.filenamesuccess.push({ name: filename });
        this.checkfilesuccess = true;
      }
      else if (JSON.stringify(res) === '"Fail"') {
        this.filenamefail.push({ name: filename });
        this.checkfilefail = true;
      }
      setTimeout(() => {
        //console.log('hide');
        this.checkfilesuccess = false;
        this.checkfilefail = false;
      }, 6000);

    }).catch(err => {
      //console.log('----- Error UploadingFile -----' + JSON.stringify(err));
      //this.alertService.danger("Error While Uploading Files");
    });
   
  }

  updateTicketType() {
    this.ticketTypeList = this.allTicketTypeList.filter(x =>
      x.CompanyID === this.createTicketForm.get('CompanyID').value && x.ProjectID === this.createTicketForm.get('ProjectID').value);
  }

  createTicket() {
    this.engineService.validateUser();
    if (this.createTicketForm.status === 'VALID') {
      // console.log(this.createTicketForm.value);
      this.url = 'Ticket/PostTicket';
      this.engineService.postData(this.url, this.createTicketForm.value).then(response => {
        console.log('--------Response---------', JSON.stringify(response));
        const res = response.json();
        const res2 = JSON.parse(res);
        console.log('--------Response---------', JSON.stringify(res2));
        this.data.TicketID = res2.TicketID;
        this.data.TicketNo = res2.TicketNo;
        this.data.TicketBacklogID = res2.TicketBacklogID;

        if (response.status === 201 || response.status === 200) {
          // this.alertService.success('Ticket successfully created!');
          this.ticketSaved = true;
        }
      }).catch(error => {
        // console.log(error);
        this.alertService.danger('Ticket creation failed!');
      });
    }
  }
}
