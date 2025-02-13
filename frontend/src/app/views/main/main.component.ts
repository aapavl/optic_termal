import { Component, ElementRef, OnInit, QueryList, ViewChildren, Output, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ParamControl } from 'src/types/param-control.namespace';
import { AnglesType } from 'src/types/angles.type';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ParamControlComponent } from 'src/app/shared/components/param-control/param-control.component';

import Config from '../../../../../config.json';// assert { type: "json" };
import { AuthService } from 'src/app/shared/services/auth.service';


const BASE_URL = Config.api.ip + Config.api.port + Config.api.requests.url.stream;
const PARAMS = Config.api.requests.params;



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
  params = {
    optic: {
      numbers: ParamControl.OpticParamNumbers,
      images: ParamControl.OpticParamImages
    },
    termal: {
      numbers: ParamControl.TermalParamNumbers,
      images: ParamControl.TermalParamImages
    }
  }
  // opticParam: ParamControl.Type[] = ParamControl.OpticParam;
  // termalParam: ParamControl.Type[] = ParamControl.TermalParam;
  distance: number = 1500; 
  angles: AnglesType = {   // значения получаемы из др компонентов
      horizontal: 0,
      vertical: 0
  }  

  // данные стиримов
  streamNames = Config.api.names;
  imgTermal: string = BASE_URL + PARAMS.type.termal + PARAMS.login[this.isLogged ? 'true' : 'false'];
  imgOptic: string =  BASE_URL + PARAMS.type.optic + PARAMS.login[this.isLogged ? 'true' : 'false']; // + this.stream.params.detect + this.opticParam[3].active;

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
      
      this.imgTermal = BASE_URL + PARAMS.type.termal + PARAMS.login[this.isLogged ? 'true' : 'false'];
      this.imgOptic = BASE_URL + PARAMS.type.optic + PARAMS.login[this.isLogged ? 'true' : 'false'];
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

    switch (name) {
      case this.streamNames.optic: {
        this.params.optic.numbers[id].value = value;
        console.log(name, this.params.optic.numbers[id].value );
        break;
      }
      case this.streamNames.termal: {
        this.params.termal.numbers[id].value = value;
        console.log(name, this.params.termal.numbers[id].value );
        break;
      }
    }
    // if (name === this.streamNames.optic) {
    //   this.params.optic.numbers[id].value = value;
    //   console.log(name, this.params.optic.numbers[id].value );
    // }

    // if (name === this.streamNames.termal) {
    //   this.params.termal.numbers[id].value = value;
    //   console.log(name, this.params.termal.numbers[id].value );
    // }
  }

  onParamBoolChange(active: boolean, name: string, id: number) {
    console.log("Переключили режим ", name, active);
    
    // *** надо учитывать id (что это точно нейронка)
    switch (name) {
      case this.streamNames.optic: {
        console.log("Глаз бога (NN): ", name, active);
        
        // this.imgOptic = this.stream.port + this.stream.params.optic + this.stream.params.detect + this.opticParam[3].active;

        break;
      }
      case this.streamNames.termal: {
        console.log("Глаз бога (NN): ", name, active);
        // this.imgTermal = this.stream.port + this.stream.params.termal + this.stream.params.detect + this.termalParam[3].active;

        break;
      }
      }
  }


}
