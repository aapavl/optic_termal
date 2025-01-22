import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PresetType } from 'src/types/preset.type';



@Component({
  selector: 'input-map-component',
  templateUrl: './input-map.component.html',
  styleUrls: ['./input-map.component.scss']
})
export class InputMapComponent implements OnInit {

  // inputValue: number = 0;
  @Input() route!: PresetType; 
  @Output() valueChange = new EventEmitter<PresetType>();
  @Output() clickDelete = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onValueChange() {
    this.valueChange.emit({ id: this.route.id, name: this.route.name, value: this.route.value });  // Отправляем новое значение в родительский компонент
  }

  clickTrash() {
    this.clickDelete.emit(this.route.id); 
  }
  
}
