import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ResponseTypes } from 'src/types/response-api.namespace';
import Config from '../../../../../config.json';
import { MatSnackBar } from '@angular/material/snack-bar';


const REQUESTS  = Config.lib.requests ;


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private userId: number = -1;

  private isLogged = new BehaviorSubject<boolean>(false);        // текущщее состояние
  isLogged$: Observable<boolean> = this.isLogged.asObservable(); // оповещение для слушателей


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  constructor(
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
  ) { 
    this.onLogin();
  }


  ngOnDestroy(): void {
    this.onCleanup();
  }



  // ------------------------------------------------------------------
  // --- PUBLIC -------------------------------------------------------
  // ------------------------------------------------------------------

  getUserId() {
    return this.userId;
  }

  onLogin() {
    console.log('Запрос на тепляк');
    
    this.apiService.initialize(REQUESTS.init.params.protocolType)
    .subscribe({
      next: (response: ResponseTypes.Default) => {
        console.log('Init response:', response);
        if (response.error) {
          this._snackBar.open("Потеряна связь умным устройством...");
          throw new Error(response.message);
        }
        this.login();
      },
    });
  }

  onCleanup() {
    this.apiService.cleanup(REQUESTS.cleanup.params.protocolType)
    .subscribe((response: ResponseTypes.Default) => {
        console.log('Cleanup response:', response);
        this.loggedChange(-1);
    });
  }



  // ------------------------------------------------------------------
  // --- PRIVATE -----------------------------------------------------
  // ------------------------------------------------------------------

  private login() {
    this.apiService.login().subscribe({
      next: (response: ResponseTypes.Default | ResponseTypes.Login) => {
        console.log('Login response:', response);
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

  private loggedChange(userId: number) {
    this.userId = userId;
    this.isLogged.next(userId > 0 ? true : false); 
  }

}
