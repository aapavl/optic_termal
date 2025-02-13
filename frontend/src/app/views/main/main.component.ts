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

 // подписочка
  private subscriptions: Subscription = new Subscription();

  // доступен ли тепляк
  private isLogged: boolean = false;
  private userId: number = -1;


  // параметры тепляка ( *** надо будут учесть не начальное положение...)
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
  // distance: number = 1500; 
  // angles: AnglesType = {   // *** должно быть получаемым значением
  //     horizontal: 0,
  //     vertical: 0
  // }  

  // данные стиримов
  streamNames = Config.api.names;
  imgTermal: string = BASE_URL + PARAMS.type.termal + PARAMS.login[this.isLogged ? 'true' : 'false'];
  imgOptic: string =  BASE_URL + PARAMS.type.optic + PARAMS.login[this.isLogged ? 'true' : 'false']; // + this.stream.params.detect + this.opticParam[3].active;

  
  
  // ------------------------------------------------------------------
  // --- ЗАГРУЗКА -----------------------------------------------------
  // ------------------------------------------------------------------

  constructor(
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
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
      console.log('Change logged: ', data);
      this.isLogged = data;
      this.userId = this.authService.getUserId();
      
      this.imgTermal = BASE_URL + PARAMS.type.termal + PARAMS.login[this.isLogged ? 'true' : 'false'];
      this.imgOptic = BASE_URL + PARAMS.type.optic + PARAMS.login[this.isLogged ? 'true' : 'false'];
    });
    this.subscriptions.add(auth);
  }

}
