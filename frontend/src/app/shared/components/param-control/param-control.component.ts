import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ParamControl } from 'src/types/param-control.namespace';

import Config from '../../../../../../config.json';//  assert { type: "json" };
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

  @Input() paramInput!: ParamControl.TypeBool | ParamControl.TypeNumber;
  paramBool: ParamControl.TypeBool | null = null;  
  paramNumber: ParamControl.TypeNumber | null = null; 

  // уведомления main.component об изменениях (значения - для spinbox; on|off - для переключателей)
  @Output() valueChange = new EventEmitter<number>(); 
  @Output() activeChange = new EventEmitter<boolean>();

  iconPath: string = '';      // путь для иконок 
  isSwapper: boolean = false; // флаг что пришел переключатель 

  value: string = "";         // переменная для отображения значения в элементе

  private isLogged: boolean = false;
  private userId: number = -1;

  private subscriptions: Subscription = new Subscription();

  private ptzCommand = Config.lib.requests.ptz.params.command;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
   ) { }

  ngOnInit(): void {
    // фиксируем переданный тип за нужными переменными
    if ('image' in this.paramInput) {
      this.paramBool = this.paramInput as ParamControl.TypeBool;
      this.iconPath = `assets/images/${this.paramBool.image + (this.paramBool.active ? '-active' : '')}.png`
    } else {
      this.paramNumber = this.paramInput as ParamControl.TypeNumber;
    }

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
    if (!this.paramNumber) return;

    // немного сделали костыль для нормального отображения целих значений 
    let valueStr = this.paramNumber.value.toString();
    this.value = (this.paramNumber.value as number) % 1 === 0 ? valueStr + '.0' : valueStr;
  }


  onBtnDown(side: number) {
    if (!this.paramNumber) return;

    let command: number | null = null;
    if (this.paramNumber.text === "Фокус" && side > 0) {
      command = this.ptzCommand.zoomMinus;
    }
    if (this.paramNumber.text === "Фокус" && side < 0) {
      command = this.ptzCommand.focusPlus;
    }
    if (this.paramNumber.text === "Масштаб" && side > 0) {
      command = this.ptzCommand.zoomMinus;
    }
    if (this.paramNumber.text === "Масштаб" && side < 0) {
      command = this.ptzCommand.zoomPlus;
    }

    if (!command) return;
    // this.commandActive = true;
    this.subscribePtzParams(command);
  }

  onBtnUp() {
    // this.commandActive = false;
    this.subscribePtzParams(this.ptzCommand.stop);
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
    if (!this.paramNumber) return;

    this.paramNumber.value = parseFloat((this.paramNumber.value + (side) * STEP_VALUE).toFixed(1));
    this.convertValueToStr();
    this.valueChange.emit(this.paramNumber.value);   // отправка обновленных данных

    console.log("вызов PTZ", this.paramNumber.text, side);

    if (!this.isLogged) return;
  }

  
  clickSwaper() {
    if (!this.paramBool) return;

    this.paramBool.active = !this.paramBool.active;
    this.iconPath = `assets/images/${this.paramBool.image + (this.paramBool.active ? '-active' : '')}.png`;
    this.activeChange.emit(this.paramBool.active); // отправка обновленных данных
  }

}
