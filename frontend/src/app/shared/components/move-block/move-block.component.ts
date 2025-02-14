import { Component } from '@angular/core';
import Config from '../../../../../../config.json';
import { IronService } from '../../services/iron.service';


@Component({
  selector: 'move-block-component',
  templateUrl: './move-block.component.html',
  styleUrls: ['./move-block.component.scss']
})
export class MoveBlockComponent {

  ptzCommand = Config.lib.requests.ptz.params.command;

  private isDoubleCommand: boolean = false; // флаг остановки кнопок диагональных сигналов 

  
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  constructor(
    private ironService: IronService,
  ) { }


  // ------------------------------------------------------------------
  // --- СОБЫТИЯ ------------------------------------------------------
  // ------------------------------------------------------------------
 
  // *** скорее всего надо делать универсальным для движение по диагонали (перебивается сигнал)
  async onBtnDown(command1: number, command2: number = -1) {

    if (command2 < 0) {
      this.ironService.ptzCommand(command1, "move");
    } else {
      this.isDoubleCommand = true;

      while (this.isDoubleCommand) {
        this.ironService.ptzCommand(command1, "move");
        await this.ironService.delay(0.2);
        this.ironService.ptzCommand(command2, "move");
        await this.ironService.delay(0.2);
      }
    }
  }

  onBtnUp() {
    this.isDoubleCommand = false;
    this.ironService.ptzCommand(this.ptzCommand.stop, "stop");
  }
}
