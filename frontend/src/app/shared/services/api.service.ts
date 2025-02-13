import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import Config from '../../../../../config.json';//  assert { type: "json" };
import { ResponseTypes } from 'src/types/response-api.namespace';


const requests = Config.lib.requests;
const BASE_URL: string = Config.lib.ip + Config.lib.port;



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  initialize(protocolType: number): Observable<ResponseTypes.Default> {
    return this.http.post<ResponseTypes.Default>(`${BASE_URL + requests.init.url}`, { protocolType });
  }

  cleanup(protocolType: number): Observable<ResponseTypes.Default> {
    return this.http.post<ResponseTypes.Default>(`${BASE_URL + requests.cleanup.url}`, { protocolType });
  }

  login(): Observable<ResponseTypes.Default | ResponseTypes.Login> {
      return this.http.post<ResponseTypes.Default | ResponseTypes.Login>(`${BASE_URL + requests.login.url}`, { });
  }

  ptz(userId: number, channelId:number, command: number): Observable<ResponseTypes.Default | ResponseTypes.Ptz> {
    return this.http.post<ResponseTypes.Default | ResponseTypes.Ptz>(`${BASE_URL + requests.ptz.url}`, { userId, channelId, command });
  }

  wiper(userId: number, wiperAction: number): Observable<ResponseTypes.Default | ResponseTypes.Wiper> {
    return this.http.post<ResponseTypes.Default | ResponseTypes.Wiper>(`${BASE_URL + requests.wiper.url}`, { userId, wiperAction });
  }
}
