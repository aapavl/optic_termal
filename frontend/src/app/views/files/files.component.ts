import { Component, OnInit } from '@angular/core';
import { Events } from 'hls.js';
import { ParamControl } from 'src/types/param-control.namespace';
import Config from '../../../assets/config.json';// assert { type: "json" };

// const Config = require('../../../../config.json');


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  file: string = "";
  imgSrc: string | null = null
  isImage: boolean = false;

  nnParam: ParamControl.Type = ParamControl.NnParam;

  stream: any = Config.api.stream;
  path: string = this.stream.port + this.stream.params.file;

  constructor() { }

  ngOnInit(): void {
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.file = file.name; // для оторажения имени
        console.log(file);
  
        this.imgSrc = this.path + this.file + this.stream.params.detect + this.nnParam.active; 
    }
  }


  // обновляем фото на пропущеное через nn
  onNN(): void {
    console.log(this.nnParam.active);
    this.imgSrc = this.path + this.file + this.stream.params.detect + this.nnParam.active; 
  }
}
