import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import Config from '../../../../../config.json';


const WIPER_COMMAND = Config.lib.requests.wiper.params.command;


@Injectable({
  providedIn: 'root'
})
export class IronService {

  // доступен ли тепляк
  private isLogged: boolean = false;
  private userId: number = -1;

  // подписочка
  private subscriptions: Subscription = new Subscription();
  

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  constructor(
      private authService: AuthService,
      private apiService: ApiService,
    ) { }

  ngOnInit(): void {
    this.subscribeAuth();
  }
 
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  subscribeAuth() {
    const auth = this.authService.isLogged$.subscribe((data: boolean) => {
      this.isLogged = data;
      this.userId = this.authService.getUserId();
    });
    this.subscriptions.add(auth);
  }

  

  // ------------------------------------------------------------------
  // --- ЗАПРОСЫ ------------------------------------------------------
  // ------------------------------------------------------------------

  ptzCommand(command: number, description: string = "") {
    console.log("(PTZ):", description, command, this.isLogged);  // *** для теста

    if (!this.isLogged) return;

    const tmp = this.apiService.ptz(this.userId, 0, command)
      .subscribe(response => {
        console.log("PTZ response:", response);
    });
    this.subscriptions.add(tmp);
  }

  wiperCommand() {
    console.log("(Wiper):", this.isLogged);

    if (!this.isLogged) return;
    this.apiService.wiper(this.userId, WIPER_COMMAND.on)
      .subscribe(response => {
        console.log("Wiper response:", response);

        setTimeout(() => {
          this.apiService.wiper(this.userId, WIPER_COMMAND.off)
          .subscribe(response => { console.log("Wiper response:", response); });
        }, 500);
    });
  }
}
