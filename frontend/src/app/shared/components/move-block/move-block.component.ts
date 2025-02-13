import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconsMoveArrow } from '../../../../types/svg/icons-move-arrow.enum';
import { AnglesType } from '../../../../types/angles.type';
import Config from '../../../../../../config.json';
import { IronService } from '../../services/iron.service';



@Component({
  selector: 'move-block-component',
  templateUrl: './move-block.component.html',
  styleUrls: ['./move-block.component.scss']
})
export class MoveBlockComponent {

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


  ptzCommand = Config.lib.requests.ptz.params.command;

  

  // ------------------------------------------------------------------
  // --- ЗАГРУЗКА -----------------------------------------------------
  // ------------------------------------------------------------------

  constructor(
    private sanitizer: DomSanitizer,
    private ironService: IronService,
  ) { }

  ngOnInit(): void {
    this.initSvg();
  }
 
  // подставляем иконки в верстку  
  initSvg() {
    this.icon_arrow_up = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.up);
    this.icon_arrow_down = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.down);

    this.icon_arrow_left = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.left);
    this.icon_arrow_center = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.center);
    this.icon_arrow_right = this.sanitizer.bypassSecurityTrustHtml(IconsMoveArrow.right);
  }



  // ------------------------------------------------------------------
  // --- СОБЫТИЯ ------------------------------------------------------
  // ------------------------------------------------------------------
 
  onBtnDown(command: number) {
    this.ironService.ptzCommand(command, "move");
  }

  onBtnUp() {
    this.ironService.ptzCommand(this.ptzCommand.stop, "stop");
  }
}
