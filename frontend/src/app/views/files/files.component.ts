import { Component, OnInit } from '@angular/core';
import { Events } from 'hls.js';
import { ParamControl } from 'src/types/param-control.namespace';
import Config from '../../../../../config.json';// assert { type: "json" };



const BASE_URL = Config.api.ip + Config.api.port + Config.api.requests.url.file;
const PARAMS = Config.api.requests.params;



@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  fileName: string = "";
  imgSrc: string | null = null
  isImage: boolean = false;

  nnParam: ParamControl.Type = ParamControl.NnParam;
  
  // private params = Config.api.requests.params;

  constructor() { }

  ngOnInit(): void {
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.fileName = file.name; // для оторажения имени
        console.log(file);
  
        // *** сделать для всех типов
        this.imgSrc = BASE_URL + PARAMS.type.optic +  
                      PARAMS.file + this.fileName + 
                      PARAMS.detect[this.nnParam.active ? 'true' : 'false']; 
    }
  }


  // обновляем фото на пропущеное через nn
  onNN(): void {
    console.log(this.nnParam.active); 
    this.imgSrc = BASE_URL + PARAMS.type.optic +  
                  PARAMS.file + this.fileName + 
                  PARAMS.detect[this.nnParam.active ? 'true' : 'false'];
  }
}
