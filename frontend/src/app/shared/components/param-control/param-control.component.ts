import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ParamControl } from 'src/types/param-control.namespace';

import Config from '../../../../assets/config.json';//  assert { type: "json" };
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

// const Config = require('../../../../../config.json');

const STEP_VALUE: number = 0.1;  // величина шага ( может быть разной для всех устройств и параметров)



@Component({
  selector: 'param-control-component',
  templateUrl: './param-control.component.html',
  styleUrls: ['./param-control.component.scss']
})
export class ParamControlComponent implements OnInit {

  @Input() params!: ParamControl.Type;

  // уведомления main.component об изменениях (значения - для spinbox; on|off - для переключателей)
  @Output() valueChange = new EventEmitter<number>(); 
  @Output() activeChange = new EventEmitter<boolean>();

  iconPath: string = '';      // путь для иконок 
  isSwapper: boolean = false; // флаг что пришел переключатель 

  value: string = "";         // переменная для отображения значения в элементе

  private isLogged: boolean = false;
  private userId: number = -1;

  private subscriptions: Subscription = new Subscription();

  command = {
    zoomOut: Config.params.ptzCommand.PTZ_NEAR,
    zoomIn: Config.params.ptzCommand.PTZ_FAR,
    focusOut: Config.params.ptzCommand.PTZ_FOCUS_NEAR,
    focusIn: Config.params.ptzCommand.PTZ_FOCUS_FAR,
    stop: Config.params.ptzCommand.PTZ_STOP
  }


  constructor(
    private authService: AuthService,
    private apiService: ApiService,
   ) { }

  ngOnInit(): void {
    this.isSwapper = typeof this.params.value === 'string' ? true : false;
    this.iconPath = `assets/images/${this.params.value + (this.params.active ? '-active' : '')}.png`

    this.convertValueToStr();
    this.subscribeAuth();
  }


  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  subscribeAuth() {
    const auth = this.authService.isLogged$.subscribe((data: boolean) => {
      this.isLogged = data;
      this.userId = this.authService.getUserId();
    });
    this.subscriptions.add(auth);
  }

  convertValueToStr() {
    if (this.isSwapper) return;

    // немного сделали костыль для нормального отображения целих значений 
    let valueStr = this.params.value.toString();
    this.value = (this.params.value as number) % 1 === 0 ? valueStr + '.0' : valueStr;
  }


  onBtnDown(side: number) {
    let command: number | null = null;
    if (this.params.text === "Фокус" && side > 0) {
      command = this.command.focusOut;
    }
    if (this.params.text === "Фокус" && side < 0) {
      command = this.command.focusIn;
    }
    if (this.params.text === "Масштаб" && side > 0) {
      command = this.command.zoomOut;
    }
    if (this.params.text === "Масштаб" && side < 0) {
      command = this.command.zoomIn;
    }

    if (!command) return;
    // this.commandActive = true;
    this.subscribePtzParams(command);
  }

  onBtnUp() {
    // this.commandActive = false;
    this.subscribePtzParams(this.command.stop);
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



  clickSpinbox(side: number) {
    this.params.value = parseFloat(((this.params.value as number) + (side) * STEP_VALUE).toFixed(1));
    this.convertValueToStr();
    this.valueChange.emit(this.params.value);   // отправка обновленных данных

    console.log("вызов PTZ", this.params.text, side);

    if (!this.isLogged) return;
  }

  
  clickSwaper() {
    this.params.active = !this.params.active;
    this.iconPath = `assets/images/${this.params.value + (this.params.active ? '-active' : '')}.png`;
    this.activeChange.emit(this.params.active); // отправка обновленных данных
  }

}
