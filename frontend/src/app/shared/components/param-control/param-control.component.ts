import { Component, Input, OnInit } from '@angular/core';
import { ParamControl } from 'src/types/param-control.namespace';

import Config from '../../../../../../config.json';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'param-control-component',
  templateUrl: './param-control.component.html',
  styleUrls: ['./param-control.component.scss']
})
export class ParamControlComponent implements OnInit {

  // тело параметра
  @Input() paramInput!: ParamControl.TypeBool | ParamControl.TypeNumber;
  paramBool: ParamControl.TypeBool | null = null;  
  paramNumber: ParamControl.TypeNumber | null = null; 
  
  // путь для иконок 
  iconPath: string = '';  

  // доступен ли тепляк
  private isLogged: boolean = false;
  private userId: number = -1;
  private ptzCommand = Config.lib.requests.ptz.params.command;

  // подписочка
  private subscriptions: Subscription = new Subscription();


  
  // ------------------------------------------------------------------
  // --- ЗАГРУЗКА -----------------------------------------------------
  // ------------------------------------------------------------------

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

    this.subscribeAuth();
  }



  // ------------------------------------------------------------------
  // --- ПОДПИСОЧКИ ---------------------------------------------------
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

  subscribePtzParams(command: number) {
    console.log("(PTZ): ", this.paramInput.text, command, this.isLogged); // для теста
    if (!this.isLogged) return;

    const ptz = this.apiService.ptz(this.userId, 0, command)
      .subscribe(response => {
        console.log('PTZ response:', response);
    });
    this.subscriptions.add(ptz);
  }



  // ------------------------------------------------------------------
  // --- СОБЫТИЯ ------------------------------------------------------
  // ------------------------------------------------------------------

  onBtnDown(side: number) {
    if (!this.paramNumber) return;

    let command: number | null = null;
    if (this.paramNumber.text === "Фокус") {
      command = side < 0 ? this.ptzCommand.focusMinus : this.ptzCommand.focusPlus
    }
    if (this.paramNumber.text === "Масштаб") {
      command = side < 0 ? this.ptzCommand.zoomMinus : this.ptzCommand.zoomPlus
    }

    if (!command) return;
    this.subscribePtzParams(command);
  }

  onBtnUp() {
    this.subscribePtzParams(this.ptzCommand.stop);
  }

  clickSwaper() {
    if (!this.paramBool) return;

    this.paramBool.active = !this.paramBool.active;
    this.iconPath = `assets/images/${this.paramBool.image + (this.paramBool.active ? '-active' : '')}.png`;
  }

}
