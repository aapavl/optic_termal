import { Component, ElementRef, OnInit, QueryList, ViewChildren, Output, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ParamControl } from 'src/types/param-control.namespace';
import { AnglesType } from 'src/types/angles.type';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ParamControlComponent } from 'src/app/shared/components/param-control/param-control.component';

import Config from '../../../assets/config.json';// assert { type: "json" };
import { AuthService } from 'src/app/shared/services/auth.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // все подписочки сохраняем сюда (в ngOnDestroy от всего отпишемся)
  private subscriptions: Subscription = new Subscription();


  // auth
  private userId: number = -1;
  isLogged: boolean = false;


  // начальное состояние настроек (надо будут учесть текушее состояние зума ...)
  opticParam: ParamControl.Type[] = ParamControl.OpticParam;
  termalParam: ParamControl.Type[] = ParamControl.TermalParam;
  distance: number = 1500; 
  angles: AnglesType = {   // значения получаемы из др компонентов
      horizontal: 0,
      vertical: 0
  }  

  // данные стиримов
  stream = Config.api.stream;
  imgTermal: string = this.stream.port + this.stream.params.termal + this.stream.params.login + this.isLogged;
  imgOptic: string = this.stream.port + this.stream.params.optic  + this.stream.params.login + this.isLogged;// + this.stream.params.detect + this.opticParam[3].active;

  @ViewChildren(ParamControlComponent, { read: ElementRef }) paramControls!: QueryList<ElementRef>; // получили все элменты ParamControlComponent 

  constructor(
    // private apiService: ApiService, 
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
    // срауз выполняем подписку на логин и геймпад
    this.subscribeAuth();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }



  // ------------------------------------
  // подписочкa 
  subscribeAuth() {
    const auth = this.authService.isLogged$.subscribe((data: boolean) => {
      console.log('Change logged: ', data);
      this.isLogged = data;
      this.userId = this.authService.getUserId();
      
      this.imgTermal = this.stream.port + this.stream.params.termal + this.stream.params.login + this.isLogged;
      this.imgOptic = this.stream.port + this.stream.params.optic + this.stream.params.login + this.isLogged;
    });
    this.subscriptions.add(auth);
  }



  // ------------------------------------
  // команды от кнопок
  // wiper() {
  //   console.log("Типа махнули дворником (wiper)");

  //   if (!this.isLogged) return;
  //   this.apiService.wiper(this.userId, Config.params.wiperAction.on)
  //     .subscribe(response => {
  //       console.log('.Wiper: ', response);

  //       setTimeout(() => {
  //         this.apiService.wiper(this.userId, Config.params.wiperAction.off)
  //         .subscribe(response => { console.log('.Wiper: ', response); });
  //       }, 500);

  //   });
  // }

  // swapMode() {
  //   // this.

  // }



  // ------------------------------------
  // команды от дочерних элементов
  // onAnglesChange(value: AnglesType) {
  //   this.angles = value; // Обновление углов в родителе при изменении в дочернем компоненте
  // }

  onParamValueChange(value: number, name: string, id: number) {
    console.log("Крутанули параметры ", name, value);

    if (name === this.stream.optic.name) {
      this.opticParam[id].value = value;
      console.log(name, this.opticParam[id].value );
    }

    if (name === this.stream.termal.name) {
      this.termalParam[id].value = value;
      console.log(name, this.termalParam[id].value );
    }
  }

  onParamNNChange(active: boolean, name: string) {
    console.log("Переключили режим ", name, active);
    
    switch (name) {
      case this.stream.optic.name: {
        console.log("Глаз бога (NN): ", name, active);
        
        // this.imgOptic = this.stream.port + this.stream.params.optic + this.stream.params.detect + this.opticParam[3].active;

        break;
      }
      case this.stream.termal.name: {
        console.log("Глаз бога (NN): ", name, active);
        // this.imgTermal = this.stream.port + this.stream.params.termal + this.stream.params.detect + this.termalParam[3].active;

        break;
      }
      }
  }


}
