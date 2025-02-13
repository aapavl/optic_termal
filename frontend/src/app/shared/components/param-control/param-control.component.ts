import { Component, Input } from '@angular/core';
import { ParamControl } from 'src/types/param-control.namespace';
import { IronService } from '../../services/iron.service';
import Config from '../../../../../../config.json';


const PTZ_COMMAND = Config.lib.requests.ptz.params.command;


@Component({
  selector: 'param-control-component',
  templateUrl: './param-control.component.html',
  styleUrls: ['./param-control.component.scss']
})
export class ParamControlComponent {

  // тело параметра
  @Input() paramInput!: ParamControl.TypeBool | ParamControl.TypeNumber;
  paramBool: ParamControl.TypeBool | null = null;  
  paramNumber: ParamControl.TypeNumber | null = null; 
  
  // путь для иконок 
  iconPath: string = '';  

  
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  constructor(
    private ironService: IronService,
   ) { }

  ngOnInit(): void {
    // фиксируем переданный тип за нужными переменными
    if ('image' in this.paramInput) {
      this.paramBool = this.paramInput as ParamControl.TypeBool;
      this.iconPath = `assets/images/${this.paramBool.image + (this.paramBool.active ? '-active' : '')}.png`
    } else {
      this.paramNumber = this.paramInput as ParamControl.TypeNumber;
    }
  }



  // ------------------------------------------------------------------
  // --- СОБЫТИЯ ------------------------------------------------------
  // ------------------------------------------------------------------

  onBtnDown(side: number) {
    if (!this.paramNumber) return;

    let command: number | null = null;
    if (this.paramNumber.text === "Фокус") {
      command = side < 0 ? PTZ_COMMAND.focusMinus : PTZ_COMMAND.focusPlus
    }
    if (this.paramNumber.text === "Масштаб") {
      command = side < 0 ? PTZ_COMMAND.zoomMinus : PTZ_COMMAND.zoomPlus
    }

    if (!command) return;
    this.ironService.ptzCommand(command, this.paramNumber.text);
  }

  onBtnUp() {
    this.ironService.ptzCommand(PTZ_COMMAND.stop, "stop");
  }

  clickSwaper() {
    if (!this.paramBool) return;

    this.paramBool.active = !this.paramBool.active;
    this.iconPath = `assets/images/${this.paramBool.image + (this.paramBool.active ? '-active' : '')}.png`;
  }

}
