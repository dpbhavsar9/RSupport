import { RequestOptions, Headers, Http } from '@angular/http';
import { OnInit, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class EngineService implements OnInit {
  headers: Headers;
  options: RequestOptions;
  baseUrl = 'http://192.168.0.250:8002/api/';
  // baseUrl = 'http://192.168.0.13:8002/api/';
  URL: string;
  users: any;
  excel: any;
  excelData: any[] = [];
  excelHeaders: any[] = [];
  excelOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Your title',
    useBom: true,
    noDownload: false,
    headers: []
  };
  userRole: string;
  isClient: string;
  currentRoute: string;

  private subject = new Subject<any>();
  constructor(private http: Http, private httpC: HttpClient, private _cookieService: CookieService, private router: Router) {
    this.setHeaders();
  }

  ngOnInit() {
  }

  // Auhtorization started

  isAuthenticated(): boolean {
    try {
      const Decrypt = crypto.AES.decrypt(this._cookieService.get('response').toString(), this._cookieService.get('Oid') + 'India');
      const decryptData = Decrypt.toString(crypto.enc.Utf8);
      const Oid = JSON.parse(decryptData).Oid.toString();
      if (this._cookieService.get('Oid') !== Oid) {
        return false;
      }
      return JSON.parse(decryptData).LoggedIn;
    } catch (err) {
      this.router.navigate(['']);
      return false;
    }
  }

  isEditAuthenticated(): boolean {
    try {
      const Decrypt = crypto.AES.decrypt(this._cookieService.get('response').toString(), this._cookieService.get('Oid') + 'India');
      const decryptData = Decrypt.toString(crypto.enc.Utf8);
      const Oid = JSON.parse(decryptData).Oid.toString();
      if (this._cookieService.get('Oid') !== Oid) {
        return false;
      }
      const userRole = JSON.parse(decryptData).UserRole;
      if (userRole === 'User') {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      this.router.navigate(['']);
      return false;
    }
  }

  isMasterAuthenticated(): boolean {
    try {
      const Decrypt = crypto.AES.decrypt(this._cookieService.get('response').toString(), this._cookieService.get('Oid') + 'India');
      const decryptData = Decrypt.toString(crypto.enc.Utf8);
      const Oid = JSON.parse(decryptData).Oid.toString();
      if (this._cookieService.get('Oid') !== Oid) {
        return false;
      }
      const userRole = JSON.parse(decryptData).UserRole;
      if (userRole === 'User') {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      this.router.navigate(['']);
      return false;
    }
  }

  validateUser() {
    const Decrypt = crypto.AES.decrypt(this._cookieService.get('response').toString(), this._cookieService.get('Oid') + 'India');
    const decryptData = Decrypt.toString(crypto.enc.Utf8);
    const Oid = JSON.parse(decryptData).Oid.toString();
    if (this._cookieService.get('Oid') !== Oid) {
      this._cookieService.removeAll();
      this.router.navigate(['']);
    } else {
      return true;
    }
  }

  // Authorization completed

  getCookieData() {
    const cookieData = crypto.AES.decrypt(this._cookieService.get('response'), this._cookieService.get('Oid') + 'India');
    this.userRole = JSON.parse(cookieData.toString(crypto.enc.Utf8)).UserRole;
  }

  updateDashboardState(dashboardState: string) {
    this.subject.next({ dashboardState: dashboardState });
  }

  getDashboardState(): Observable<any> {
    return this.subject.asObservable();
  }

  setHeaders() {
    this.headers = new Headers();
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    this.headers.append('Allow', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    this.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    this.headers.append('Content-Type', 'application/json; charset=utf-8');

    this.options = new RequestOptions();
    this.options.headers = this.headers;
  }

  login(userName: string, password: string): Promise<any> {
    const _Url = this.baseUrl + 'Users/PostUserVerified';

    const data = {
      UserName: userName,
      Password: password
    };
    const body = JSON.stringify(data);
    return this.http.post(_Url, body, this.options).toPromise();
  }

  logout() {
    this._cookieService.removeAll();
  }

  getToken(): Promise<any> {
    this.URL = 'http://192.168.0.168:81/token';
    const body = {
      'username': 'user',
      'password': 'user',
      'grant_type': 'password'
    };
    return this.http.post(this.URL, body, this.options).toPromise();
  }


  getData(url: string, id?: any): Observable<any> {
    this.URL = this.baseUrl + url;
    return this.http.get(this.URL, this.options)
      .pipe(map((res: any) => res.json()));

  }

  // getKanbanSource() {
  //   this.URL = this.baseUrl + 'Ticket/GetTicStatus';
  //   return this.http.get(this.URL, this.options).map(res => res.json());
  // }


  postData(url: any, data: any): Promise<any> {
    this.URL = this.baseUrl + url;
    const body = JSON.stringify(data);
    // console.log('---- Inside Engine Service -----' + body + '------URL-------' + this.URL);
    return this.http.post(this.URL, body, this.options).toPromise();
  }

  updateData(url: any, data: any): Promise<any> {
    this.URL = this.baseUrl + url;
    const body = JSON.stringify(data);
    return this.http.put(this.URL, body, this.options).toPromise();
  }

  deleteUser(id: any): Promise<any> {
    this.URL = this.baseUrl + 'Users/DeleteUser';
    const body = JSON.stringify(id);
    return this.http.post(this.URL, body, this.options)
      .toPromise();
  }

  downloadExcel(excelData, excelName) {
    this.excelOptions.title = excelName;
    if (excelData.length > 0) {
      this.excelOptions.headers = Object.keys(excelData[0]);
    }
    this.excelData = excelData;
    this.excel = new Angular5Csv(this.excelData, excelName, this.excelOptions);
  }

  uploadFile(fileItem: File, data): Promise<any> {
    const header = new HttpHeaders();
    header.append('Access-Control-Allow-Origin', '*');
    header.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header.append('Allow', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    this.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    // this.headers.append('Content-Type', 'application/json; charset=utf-8');
    const url = this.baseUrl + 'Upload/UploadFiles';

    const formData: FormData = new FormData();
    formData.append('TicketID', data.TicketID);
    formData.append('TicketNo', data.TicketNo);
    formData.append('TicketBacklogID', data.TicketBacklogID);
    formData.append('fileItem', fileItem, data.TicketNo + '_' + fileItem.name);

    // 'http://localhost:3979/api/Upload/UploadFiles'
    return this.httpC.post(url, formData, { headers: header })
      .toPromise();
  }
}

