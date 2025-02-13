import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconsMoveArrow } from '../../../../types/svg/icons-move-arrow.enum';
import { AnglesType } from '../../../../types/angles.type';
// import { GamepadService } from '../../services/gamepad.service';
// import { GamepadBtnType, GamepadStickType, GamepadType } from 'src/types/gamapad/gamepad.type';
// import { GamepadTypes } from 'src/types/gamapad/gamepad.namespace';
// import { GamepadEnum } from 'src/types/gamapad/gamepad.enum';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import Config from '../../../../../../config.json';//  assert { type: "json" };
import { AuthService } from '../../services/auth.service';


const STEP_VALUE: number = 1;

// delay: number = 1000; // работает ли ???



@Component({
  selector: 'move-block-component',
  templateUrl: './move-block.component.html',
  styleUrls: ['./move-block.component.scss']
})
export class MoveBlockComponent implements OnInit {

  icon_arrow_up!: SafeHtml;
  icon_arrow_down!: SafeHtml;
  icon_arrow_left!: SafeHtml;
  icon_arrow_center!: SafeHtml;
  icon_arrow_right!: SafeHtml;


  @Input() angles!: AnglesType;
  @Output() anglesChange = new EventEmitter<AnglesType>();

  @ViewChild('left')   left!: ElementRef; 
  @ViewChild('right')  right!: ElementRef; 
  @ViewChild('down')   down!: ElementRef; 
  @ViewChild('up')     up!: ElementRef; 
  @ViewChild('center') center!: ElementRef; 

  private subscriptions: Subscription = new Subscription();

  // переменные для сигналов изменения событий 
  // private commandActive: boolean = false;

  ptzCommand = Config.lib.requests.ptz.params.command;

  private isLogged: boolean = false;
  private userId: number = -1;


  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private apiService: ApiService,
  ) { }



  ngOnInit(): void {
    this.initSvg();
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

 
  // подставляем иконки в верстку  
  initSvg() {
    this.icon_arrow_up = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.up);
    this.icon_arrow_down = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.down);

    this.icon_arrow_left = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.left);
    this.icon_arrow_center = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.center);
    this.icon_arrow_right = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.right);
  }

  // добавление-удаление класса 'active'
  changeStatusBtn(element: ElementRef, status: boolean) {
    // if (status) {
    //   this.renderer.addClass(element.nativeElement, 'active');
    // } else {
    //   this.renderer.removeClass(element.nativeElement, 'active'); 
    // }
  }


  // обработка событий нажатия на кнопки навигации
  updateAngles() {
    this.anglesChange.emit(this.angles); // Отправка обновленных данных
  }


  // DELETE click, надо сделать универсальным 
  clickMoveX(side: number) {
    this.angles.horizontal += (side) * STEP_VALUE;
    this.updateAngles();
  }

  clickMoveY(side: number) {
    this.angles.vertical += (side) * STEP_VALUE;
    this.updateAngles();
  }

  clickMoveCenter() {
    this.angles.horizontal = 0;
    this.angles.vertical = 0;
    this.updateAngles();
  }



  onBtnDown(command: number) {
    // this.commandActive = true;
    this.subscribePtzMoveXY(command);
  }

  onBtnUp() {
    // this.commandActive = false;
    this.subscribePtzMoveXY(this.ptzCommand.stop);
  }
  
  subscribePtzMoveXY(command: number) {
    console.log("Тут должа шо-то делать камера (PTZ): ", command, this.isLogged);
    if (!this.isLogged) return;

    const tmp = this.apiService.ptz(this.userId, 0, command)
      .subscribe(response => {
        console.log('PTZ:', response);
    });
    this.subscriptions.add(tmp);
  }
}
