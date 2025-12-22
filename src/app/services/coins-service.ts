import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Coin } from '../models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class CoinsService {

  constructor(private http: HttpClient) {

  }

  getCoins(): Observable<Coin[]> {
    return this.http.get<Coin[]>('/api/coins');
  }

  getCoinById(id: string): Observable<Coin> {
    return this.http.get<Coin>(`/api/coins/${id}`);
  }

  deleteCoin(id: string): Observable<any> {
    return this.http.delete(`/api/coins/${id}`);
  }

  createCoin(coin: Omit<Coin, 'id' | 'updatedAt'> ): Observable<Coin> {
    return this.http.post<Coin>("/api/coins", coin, httpOptions);
  }

  editCoin(coin: Omit<Coin, 'updatedAt'>): Observable<Coin> {
    return this.http.post<Coin>(`/api/coins/${coin.id}`, coin, httpOptions);
  }
}
