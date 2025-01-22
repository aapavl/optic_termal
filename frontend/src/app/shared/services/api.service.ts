import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Config from '../../../assets/config.json';//  assert { type: "json" };
import { ResponseTypes } from 'src/types/response-api.namespace';



const BASE_URL: string = Config.localhost + Config.api.dll.port;



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  initialize(protocolType: number): Observable<ResponseTypes.Default> {
    return this.http.post<ResponseTypes.Default>(`${BASE_URL + Config.api.dll.init}`, { protocolType });
  }

  cleanup(protocolType: number): Observable<ResponseTypes.Default> {
    return this.http.post<ResponseTypes.Default>(`${BASE_URL + Config.api.dll.cleanup}`, { protocolType });
  }

  login(): Observable<ResponseTypes.Default | ResponseTypes.Login> {
      return this.http.post<ResponseTypes.Default | ResponseTypes.Login>(`${BASE_URL + Config.api.dll.login}`, { });
  }

  ptz(userId: number, channelId:number, command: number): Observable<ResponseTypes.Default | ResponseTypes.Ptz> {
    return this.http.post<ResponseTypes.Default | ResponseTypes.Ptz>(`${BASE_URL + Config.api.dll.ptz}`, { userId, channelId, command });
  }

  wiper(userId: number, wiperAction: number): Observable<ResponseTypes.Default | ResponseTypes.Wiper> {
    return this.http.post<ResponseTypes.Default | ResponseTypes.Wiper>(`${BASE_URL + Config.api.dll.wiper}`, { userId, wiperAction });
  }
}
