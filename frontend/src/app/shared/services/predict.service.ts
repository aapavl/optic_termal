// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { NnApiType } from 'src/types/nn-api.type';
// import Config from '../../../../../config.json' assert { type: "json" };
// import { ResponseTypes } from 'src/types/response-api.namespace';



// const BASE_URL: string = Config.localhost + Config.api.nn.port;



// @Injectable({
//   providedIn: 'root'
// })
// export class PredictService {

//   constructor(private http: HttpClient) { }

//   numbers(nnModelBody: NnApiType): Observable<ResponseTypes.Default | ResponseTypes.Predict> {
//     return this.http.post<ResponseTypes.Default | ResponseTypes.Predict>(
//       BASE_URL + Config.api.nn.numbers, 
//       nnModelBody, 
//       { 
//         responseType: 'json' 
//       });
//   }
  
//   synt(nnModelBody: NnApiType): Observable<ResponseTypes.Default | ResponseTypes.Predict> {
//     return this.http.post<ResponseTypes.Default | ResponseTypes.Predict>(
//       BASE_URL + Config.api.nn.synt, 
//       nnModelBody, 
//       { 
//         responseType: 'json' 
//       });
//   }

//   // image(imagePath: string): Observable<any> {
//   //   return this.http.get<any>(BASE_URL + Config.api.getImage + imagePath);
//   // }
// }
