import { Component, OnInit } from '@angular/core';
import { ParamControl } from 'src/types/param-control.namespace';
import Config from '../../../../../config.json';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';


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
  imgTermal: string | null = null;
  imgOptic: string | null = null;

  
  
  // ------------------------------------------------------------------
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
      this.isLogged = data;
      
      const isLoggedStr = this.isLogged ? 'true' : 'false';
      this.imgTermal = BASE_URL + PARAMS.type.termal + PARAMS.login[isLoggedStr];
      this.imgOptic = BASE_URL + PARAMS.type.optic + PARAMS.login[isLoggedStr];
    });
    this.subscriptions.add(auth);
  }

}
