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
  isLoopRouting: number | null = null;
  // isActive: boolean = false;

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


  // async clickLoop(): Promise<void>  {
  //   // if (!this.isLogged) return; // запуск только если запросы пройдут

  //   // выключаем другие сигналы
  //   if (!this.isLoopRouting && this.isActive) 
  //     this.isActive = true;

  //   // переключаемся на режим зацикливания
  //   this.isLoopRouting = true;
  //   this.isActive = true;

  //   while (this.isLoopRouting) {
  //     console.log("Зацикливание: ", this.isLoopRouting);
  //     await this.mapRoute(); // Дождаться завершения функции
  //   }

  //   // завершаем режим
  //   this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
  //   this.isActive = false;
  // }

  // async clickRoute(): Promise<void>  {
  //   // if (!this.isLogged) return; // запуск только если запросы пройдут

  //   // выключаем другие сигналы
  //   if (this.isLoopRouting && this.isActive) 
  //     this.isActive = true;

  //   // переключаемся на режим одиночного прохода 
  //   this.isLoopRouting = true;
  //   this.isActive = true;

  //   if (this.isActive) {
  //     console.log("Сценарий:", this.userId, this.isLogged);
  //     await this.mapRoute(); // Дождаться завершения функции
      
  //     // завершаем режим
  //     this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
  //     this.isActive = false;
  //   }
  // }

  async clickRun(isLoopNew: number) {
    // *** для теста
    // if (!this.isLogged) return; // запуск только если запросы пройдут

    // запускаем только новое действие
    if (this.isLoopRouting !== isLoopNew) {

      // завершаем запушенное действие
      if (this.isLoopRouting) {
        this.ironService.deleteDelay();
        this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
        console.log("/ end /"); // для теста
      }

      this.isLoopRouting = isLoopNew;  

      switch (this.isLoopRouting) {
        case 1: {
          console.log("Сценарий:");
          break;
        }
        case 2: {
          console.log("Зацикливание: ");
          break;
        }
        default: {
          console.log("Error: почему запустился цикл?");
          break;
        }
      }

      // вызов одиночного прохода
      if (this.isLoopRouting === 1) {
        await this.mapRoute(); 
      }
      // вызов цикла
      while (this.isLoopRouting === 2) {
        await this.mapRoute(); 
        console.log("---------"); // для теста
      }
    }
    
    // завершаем запушенное действие
    if (this.isLoopRouting) {
      this.ironService.deleteDelay();
      this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
      console.log("/ end /"); // *** для теста
    }

    this.isLoopRouting = null; // сброс активной кнопки
  }


  async mapRoute(): Promise<void> {
    let curCommand: number | null = null;

    for (const item of this.routes) {
      // завершаем действие при отмене или логауте
      // if (!this.isLoopRouting || !this.isLogged) return;
      if (!this.isLoopRouting) break; // *** для теста

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
      } 
      else {
        console.log(`ERROR: неизвестная команда ${item.name}.`);
      }
    }

    this.ironService.deleteDelay();
    this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
    // console.log("/ end /"); // для теста
  }


}
