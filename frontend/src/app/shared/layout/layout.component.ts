import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnglesType } from 'src/types/angles.type';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { IronService } from '../services/iron.service';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @ViewChild('content') content!: ElementRef;

  // переключатель для открытия/скрытия менюхи
  sidebarMin: boolean = false;

  // auth
  userId: number = -1;
  isLogged: boolean = false;
  private subscriptions: Subscription = new Subscription();

  distance: number = 1500; 
  angles: AnglesType = {   // *** значения получаемы из др компонентов
    horizontal: 0,
    vertical: 0
  } 
  

  
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  constructor(
    private authService: AuthService,
    private ironService: IronService,
  ) { }


  ngOnInit(): void {
    this.subscribeAuth();
  }
  

  // ------------------------------------------------------------------
  // --- ПОДПИСКА -----------------------------------------------------
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


  
  // ------------------------------------------------------------------
  // --- СОБЫТИЯ ------------------------------------------------------
  // ------------------------------------------------------------------

  // нажата кнопка подписки-отписки от тепляка
  authChange() {
    if (this.isLogged) {
      this.authService.onCleanup();
    } else {
      this.authService.onLogin();
    }
  }

  // нажали на лого (открытие-закрытие sidebar)
  sidebarLogo() {
    this.sidebarMin = !this.sidebarMin;

    if (this.sidebarMin) {
      this.content.nativeElement.classList.add('content-max');
    } else {
      this.content.nativeElement.classList.remove('content-max');
    }
  }

  // махнули дворником
  wiper() {
    this.ironService.wiperCommand();
  }



  // ------------------------------------------------------------------
  // --- МУСОР ? ------------------------------------------------------
  // ------------------------------------------------------------------

  // команды от дочерних элементов
  onAnglesChange(value: AnglesType) {
    this.angles = value; // Обновление углов в родителе при изменении в дочернем компоненте
    // console.log(value);
  }
}