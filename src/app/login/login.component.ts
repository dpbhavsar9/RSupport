import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { EngineService } from '../services/engine.service';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  loggedIn = false;
  UserName: string;
  Password: string;
  cryptkey: string;
  _Url = 'http://192.168.0.168:81/api/Users/PostUserVerified';

  constructor(
    private alertService: AlertService,
    private router: Router,
    private http: Http,
    private engineService: EngineService,
    private _cookieService: CookieService
  ) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      UserName: new FormControl(null, [
        Validators.required,
        // Validators.minLength(6)
      ]),
      Password: new FormControl(null, [
        Validators.required,
        // Validators.minLength(6),
        // Validators.maxLength(12)
      ])
    });

    this.resetCredentials();
  }

  resetCredentials() {
    this._cookieService.removeAll();
  }

  onLogin() {
    // this.spinner.show();
    this.UserName = this.loginForm.get('UserName').value;
    this.Password = this.loginForm.get('Password').value;

    this.engineService.login(this.UserName, this.Password).then(response => {

      if (response.status === 200 || response.status === 201) {
        const result = JSON.parse(response._body);
        this._cookieService.put('Oid', result.Oid);
        this.cryptkey = result.Oid + 'India';
        this.loggedIn = true;
        const data = {
          Oid: result.Oid,
          User: this.UserName,
          UserName: result.UserName,
          Email: result.Email,
          LoggedIn: this.loggedIn,
          UserRole: result.UserRole,
          UserCompany: result.UserCompany,
          Password: result.Password
        };
        const stringData = JSON.stringify(data);
        
        const Encrypt = crypto.AES.encrypt(stringData, this.cryptkey);
        this._cookieService.put('response', Encrypt.toString());
        this.router.navigate(['dashboard']);

      } else {
        this.alertService.info('Please try again later');
      }
    }).catch(error => {
      this.alertService.danger('Enter Valid Credentials');
      this.loggedIn = false;
      this._cookieService.removeAll();
    });
  }
  onSignup() {
    this.router.navigate(['signup']);
  }
}
