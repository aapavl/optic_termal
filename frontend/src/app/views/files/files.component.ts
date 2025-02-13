import { Component } from '@angular/core';
import { ParamControl } from 'src/types/param-control.namespace';
import Config from '../../../../../config.json';



const BASE_URL = Config.api.ip + Config.api.port + Config.api.requests.url.file;
const PARAMS = Config.api.requests.params;



@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent {

  fileName: string = "";         // для оторажения имени файла
  imgSrc: string | null = null;  // для оторажения самого файла

  paramNN: ParamControl.TypeBool = {
      text: "NN",
      image: "eye-god",
      active: false,
      focus: false
  };
  


  // ------------------------------------------------------------------
  // --- ЗАГРУЗКА -----------------------------------------------------
  // ------------------------------------------------------------------

  constructor() { }


    
  // ------------------------------------------------------------------
  // --- МЕТОДЫ -----------------------------------------------------
  // ------------------------------------------------------------------

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.fileName = file.name; 
        console.log(file); // для теста
  
        // *** сделать для всех типов
        this.imgSrc = BASE_URL + PARAMS.type.optic +  
                      PARAMS.file + this.fileName + 
                      PARAMS.detect[this.paramNN.active ? 'true' : 'false']; 
    }
  }


  // обновляем фото на пропущеное через nn
  onNN(): void {
    console.log(this.paramNN.active); // для теста
    this.imgSrc = BASE_URL + PARAMS.type.optic +  
                  PARAMS.file + this.fileName + 
                  PARAMS.detect[this.paramNN.active ? 'true' : 'false'];
  }
}
