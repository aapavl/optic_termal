import { Component, Input, OnInit } from '@angular/core';
import Config from '../../../../../../config.json';
import { PresetType } from 'src/types/preset.type';
import { IronService } from '../../services/iron.service';


const PTZ_COMMAND = Config.lib.requests.ptz.params.command;


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

  
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  
  constructor(
    private ironService: IronService,
  ) { }

  ngOnInit(): void {
    this.addRoute();
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

  isActive: boolean = false;

  async loopRoute(): Promise<void>  {
    this.isLoopRouting = !this.isLoopRouting;
    this.isActive = !this.isActive;

    console.log("--> зацикливание: ", this.isLoopRouting);

    while (this.isLoopRouting) {
      await this.mapRoute(); // Дождаться завершения функции
    }
  }

  async clickRoute(): Promise<void>  {
    this.isActive = !this.isActive;

    if (this.isActive) {
      await this.mapRoute(); // Дождаться завершения функции
    }
  }

  async mapRoute(): Promise<void> {
    console.log("Запустили сценарий:", this.userId, this.isLogged);

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
        await this.delay(item.value);
        this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
        console.log(` ${item.name}.`);
      } 
      else {
        console.log(`ERROR: команда ${item.name} не сработала.`);
      }
    }
    console.log("Сценарий завершен.");
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
  }
}
