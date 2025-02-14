import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PresetType } from 'src/types/preset.type';



@Component({
  selector: 'input-map-component',
  templateUrl: './input-map.component.html',
  styleUrls: ['./input-map.component.scss']
})
export class InputMapComponent implements OnInit {

  @Input() route!: PresetType; 
  @Output() valueChange = new EventEmitter<PresetType>();
  @Output() clickDelete = new EventEmitter<number>();



  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  constructor() { }

  ngOnInit(): void {
  }



  // ------------------------------------------------------------------
  // --- СОБЫТИЯ ------------------------------------------------------
  // ------------------------------------------------------------------

  // отправляем новое значение в родительский компонент
  onValueChange() {
    this.valueChange.emit({ id: this.route.id, name: this.route.name, value: this.route.value }); 
  }

  // удаление элемента
  clickTrash() {
    this.clickDelete.emit(this.route.id); 
  }
  
}
