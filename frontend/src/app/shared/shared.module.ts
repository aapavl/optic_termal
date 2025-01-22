import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParamControlComponent } from './components/param-control/param-control.component';
import { MoveBlockComponent } from './components/move-block/move-block.component';
import { MoveRoutingComponent } from './components/move-routing/move-routing.component';
import { InputMapComponent } from './components/input-map/input-map.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ParamControlComponent,
    MoveBlockComponent,
    MoveRoutingComponent,
    InputMapComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    ParamControlComponent,
    MoveBlockComponent,
    MoveRoutingComponent,
    InputMapComponent,
  ]
})
export class SharedModule { }
