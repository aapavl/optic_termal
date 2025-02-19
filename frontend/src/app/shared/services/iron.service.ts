import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import Config from '../../../../../config.json';


const WIPER_COMMAND = Config.lib.requests.wiper.params.command;
const STOP = Config.lib.requests.ptz.params.command.stop;


@Injectable({
  providedIn: 'root'
})
export class IronService {

  // доступен ли тепляк
  private isLogged: boolean = false;
  private userId: number = -1;
  private subscriptionAuth: Subscription = new Subscription();

  // Идентификатор таймера
  private timeoutId: NodeJS.Timeout | undefined = undefined;
  

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
    this.subscriptionAuth.unsubscribe();
  }

  subscribeAuth() {
    this.subscriptionAuth = this.authService.isLogged$.subscribe((data: boolean) => {

      // отменяем все действия при логауте пользователя
      if (this.isLogged && data === false) {
        this.deleteDelay();
        this.ptzCommand(STOP, "stop");
      }

      this.isLogged = data;
      this.userId = this.authService.getUserId();
    });
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      // Очищаем предыдущий таймер, если он существует
      if (this.timeoutId) {
        this.deleteDelay();
      }

      // Обновляем текущий таймер
      this.timeoutId = setTimeout(() => {
        resolve();      // Завершаем промис успешно
        this.timeoutId = undefined  // Очищаем ресурсы
      }, ms * 1000);
    });
  }

  
  deleteDelay() {
    clearTimeout(this.timeoutId); // Очищаем таймер
    this.timeoutId = undefined    // Очищаем ресурсы
    console.log("Таймер был сброшен");
  }

  

  // ------------------------------------------------------------------
  // --- ЗАПРОСЫ ------------------------------------------------------
  // ------------------------------------------------------------------

  ptzCommand(command: number, description: string = "") {
    console.log("(PTZ):", description, command, this.isLogged);  // *** для теста

    if (!this.isLogged) return;

    this.apiService.ptz(this.userId, 0, command)
      .subscribe(response => {
        console.log("PTZ response:", response);
    });
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
