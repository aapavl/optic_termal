import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnglesType } from 'src/types/angles.type';


import Config from '../../../../../config.json';// assert { type: "json" };
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isOpenSpryt: boolean = true;
  sidebarMin: boolean = false;

 
  // auth
  userId: number = -1;
  isLogged: boolean = false;
  
  private wiperCommand = Config.lib.requests.wiper.params.command;

  distance: number = 1500; 
  angles: AnglesType = {   // *** значения получаемы из др компонентов
    horizontal: 0,
    vertical: 0
  } 
  
  private subscriptions: Subscription = new Subscription();

  @ViewChild('content') content!: ElementRef;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {
    this.subscribeAuth();
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  subscribeAuth() {
    const auth = this.authService.isLogged$.subscribe((data: boolean) => {
      console.log('Change logged: ', data);
      this.isLogged = data;
      this.userId = this.authService.getUserId();
    });
    this.subscriptions.add(auth);
  }


  authChange() {
    if (this.isLogged) {
      this.authService.onCleanup();
    } else {
      this.authService.onLogin();
    }
  }


  toggle() {
    this.isOpenSpryt = !this.isOpenSpryt;
  }

  sidebarLogo() {
    this.sidebarMin = !this.sidebarMin;

    if (this.sidebarMin) {
      this.content.nativeElement.classList.add('content-max');
    } else {
      this.content.nativeElement.classList.remove('content-max');
    }
  }



  // ------------------------------------
  // команды от кнопок
  wiper() {
    console.log("Типа махнули дворником (wiper)", this.userId, this.isLogged);

    if (!this.isLogged) return;
    this.apiService.wiper(this.userId, this.wiperCommand.on)
      .subscribe(response => {
        console.log('.Wiper: ', response);

        setTimeout(() => {
          this.apiService.wiper(this.userId, this.wiperCommand.off)
          .subscribe(response => { console.log('.Wiper: ', response); });
        }, 500);
    });
  }


  // mapRoute() {
  //   console.log("Запустили сценарий:", this.userId, this.isLogged);

  //   const rightElement = document.getElementById("right") as HTMLInputElement;
  //   const leftElement = document.getElementById("left") as HTMLInputElement;

  //    // Конвертируем значения в числа
  //   const rightValue = Number(rightElement.value)*1000 || 0;
  //   const leftValue = Number(leftElement.value)*1000 || 0;

  //   this.subscribePtzParams(this.command.right);
  //   setTimeout(() => {
  //     this.subscribePtzParams(this.command.stop);

  //     this.subscribePtzParams(this.command.left);
  //     setTimeout(() => {
  //       this.subscribePtzParams(this.command.stop);
  //     }, leftValue);

  //   }, rightValue);
  // }

  // subscribePtzParams(command: number) {
  //   console.log("Тут должа шо-то делать камера (PTZ): ", command, this.isLogged);
  //   if (!this.isLogged) return;

  //   const tmp = this.apiService.ptz(this.userId, 0, command)
  //     .subscribe(response => {
  //       console.log('PTZ:', response);
  //   });
  //   this.subscriptions.add(tmp);
  // }



  // ------------------------------------
  // команды от дочерних элементов
  onAnglesChange(value: AnglesType) {
    this.angles = value; // Обновление углов в родителе при изменении в дочернем компоненте
    // console.log(value);
  }
}