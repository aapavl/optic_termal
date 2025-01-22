import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { ResponseTypes } from 'src/types/response-api.namespace';
import Config from '../../../assets/config.json';//  assert { type: "json" }; 

// const Config = require('../../../../config.json');
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private userId: number = -1;

  private isLogged = new BehaviorSubject<boolean>(false);        // текущщее состояние
  isLogged$: Observable<boolean> = this.isLogged.asObservable(); // оповещение для слушателей


  constructor(
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
  ) { 
    this.onLogin();
  }


  ngOnDestroy(): void {
    this.onCleanup();
  }

  getUserId() {
    return this.userId;
  }


  onLogin() {
    this.apiService.initialize(Config.api.dll.protocolType)
    .subscribe({
      next: (response: ResponseTypes.Default) => {
        console.log('.Init:', response);
        if (response.error) {
          this._snackBar.open("Потеряна связь умным устройством...");
          throw new Error(response.message);
        }
        this.login();
      },
    });
  }


  private login() {
    this.apiService.login().subscribe({
      next: (response: ResponseTypes.Default | ResponseTypes.Login) => {
        console.log('.Login:', response);
        let error: string | null = null;
        if ((response as ResponseTypes.Default).error) error = response.message;
  
        const loginValue = response as ResponseTypes.Login;
        if (!loginValue.userId) error = "Ошибка авторизации.";
  
        if (error) {
          this._snackBar.open(error);
          throw new Error(error);
        }
        this.loggedChange(loginValue.userId);
      }
    });
  }


  onCleanup() {
    this.apiService.cleanup(Config.api.dll.protocolType).subscribe((response: ResponseTypes.Default) => {
        console.log('.Cleanup:', response);
        this.loggedChange(-1);
    });
  }

  private loggedChange(userId: number) {
    this.userId = userId;
    this.isLogged.next(userId > 0 ? true : false); 
  }

}
