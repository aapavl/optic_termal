import { Component, Input, OnInit } from '@angular/core';
import Config from '../../../../../../config.json';
import { PresetType } from 'src/types/preset.type';
import { IronService } from '../../services/iron.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';


const PTZ_COMMAND = Config.lib.requests.ptz.params.command;


@Component({
  selector: 'move-routing-component',
  templateUrl: './move-routing.component.html',
  styleUrls: ['./move-routing.component.scss']
})
export class MoveRoutingComponent implements OnInit {

  // auth
  userId: number = -1;
  isLogged: boolean = false;
  private subscriptions: Subscription = new Subscription();


  routes: PresetType[] = [];   // Массив для хранения состояний каждого компонента
  isLoopRouting: boolean = false;
  isActive: boolean = false;

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  
  constructor(
    private ironService: IronService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.addRoute();
    this.subscribeAuth();
  }



  // ------------------------------------------------------------------
  // --- ПОДПИСКА -----------------------------------------------------
  // ------------------------------------------------------------------

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
  // --- ПОДПИСКА -----------------------------------------------------
  // ------------------------------------------------------------------

  // добавляем новый элемент в маршрут
  addRoute() {
    this.routes.push({
      id: this.routes.length + 1,
      name: "left",
      value: 1
    }); // Добавляем новое "значение" для компонента
  }

  // onValueInput(updatedRoute: PresetType, index: number) {
  //   console.log('Получено новое значение:', updatedRoute.name, updatedRoute.value);  // для теста
  // }

  // удаляем элемент из маршрута
  onClickDelete(id: number) {
    this.routes.splice(id-1, 1); 
  }


  async clickLoop(): Promise<void>  {
    // if (!this.isLogged) return; // запуск только если запросы пройдут

    this.isLoopRouting = !this.isLoopRouting;
    this.isActive = !this.isActive;

    while (this.isLoopRouting) {
      console.log("Зацикливание: ", this.isLoopRouting);

      await this.mapRoute(); // Дождаться завершения функции
    }
  }

  async clickRoute(): Promise<void>  {
    // if (!this.isLogged) return; // запуск только если запросы пройдут

    this.isActive = !this.isActive;

    if (this.isActive) {
      console.log("Сценарий:", this.userId, this.isLogged);

      await this.mapRoute(); // Дождаться завершения функции
    }
  }

  async mapRoute(): Promise<void> {
    let curCommand: number | null = null;

    for (const item of this.routes) {
      if (!this.isActive) break;

      switch (item.name) {
        case "right":
          curCommand = PTZ_COMMAND.right;
          break;
        case "left":
          curCommand = PTZ_COMMAND.left;
          break;
        case "up":
          curCommand = PTZ_COMMAND.up;
          break;
        case "down":
          curCommand = PTZ_COMMAND.down;
          break;
      };
      
      if (curCommand) {
        this.ironService.ptzCommand(curCommand, item.name);
        await this.ironService.delay(item.value);
        this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
      } 
      else {
        console.log(`ERROR: команда ${item.name} не сработала.`);
      }
    }
    console.log("--------- сценарий завершен"); // для теста
  }


}
