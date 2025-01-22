import { Component, Input, OnInit } from '@angular/core';
import Config from '../../../../assets/config.json';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';
import { PresetType } from 'src/types/preset.type';



@Component({
  selector: 'move-routing-component',
  templateUrl: './move-routing.component.html',
  styleUrls: ['./move-routing.component.scss']
})
export class MoveRoutingComponent implements OnInit {

  @Input() userId!: number;
  @Input() isLogged!: boolean;

  isLoopRouting: boolean = false;

  // Массив для хранения состояний каждого компонента
  routes: PresetType[] = [];

  command = {
    left: Config.params.ptzCommand.PTZ_LEFT,
    right: Config.params.ptzCommand.PTZ_RIGHT,
    up: Config.params.ptzCommand.PTZ_UP,
    down: Config.params.ptzCommand.PTZ_DOWN,
    stop: Config.params.ptzCommand.PTZ_STOP
  }

  private subscriptions: Subscription = new Subscription();

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.addRoute();
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  addRoute() {
    this.routes.push({
      id: this.routes.length + 1,
      name: "left",
      value: 1
    }); // Добавляем новое "значение" для компонента
  }

  // onValueInput(name: number, value: number) {
  //   console.log('Получено новое значение:', name, value);  // Выводим новое значение в консоль
  // }

  onValueInput(updatedRoute: PresetType, index: number) {
    console.log('Получено новое значение:', updatedRoute.name, updatedRoute.value);  // Выводим новые данные
    // this.routes[index] = updatedRoute;  // Обновляем значение в массиве
  }

  onClickDelete(id: number) {
    this.routes.splice(id-1, 1); 
  }


  async loopRoute(): Promise<void>  {
    this.isLoopRouting = !this.isLoopRouting;   
    console.log("--> зацикливание: ", this.isLoopRouting);

    while (this.isLoopRouting) {
      await this.mapRoute(); // Дождаться завершения функции
    }
  }


  async mapRoute(): Promise<void> {
    console.log("Запустили сценарий:", this.userId, this.isLogged);

    let curCommand: number | null = null;

    for (const item of this.routes) {
      switch (item.name) {
        case "вправо":
          curCommand = this.command.right;
          break;
        case "влево":
          curCommand = this.command.left;
          break;
        case "вверх":
          curCommand = this.command.up;
          break;
        case "вниз":
          curCommand = this.command.down;
          break;
      };
      

      if (curCommand) {
        this.subscribePtzParams(curCommand);
        await this.delay(item.value);
        this.subscribePtzParams(this.command.stop);
        console.log(`Команда ${item.name} завершена.`);
      } 
      else {
        await this.delay(item.value);
        console.log(`Команда ${item.name} не сработала.`);
      }
    }
    console.log("Сценарий завершен.");
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
  }

  subscribePtzParams(command: number) {
    console.log("Тут должа шо-то делать камера (PTZ): ", command, this.isLogged);
    if (!this.isLogged) return;

    const tmp = this.apiService.ptz(this.userId, 0, command)
      .subscribe(response => {
        console.log('PTZ:', response);
    });
    this.subscriptions.add(tmp);
  }

}
