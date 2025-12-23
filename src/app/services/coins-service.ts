import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Coin } from '../models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class CoinsService {
  private http = inject(HttpClient);

  getCoins(): Observable<Coin[]> {
    return this.http.get<Coin[]>('/api/coins');
  }

  getCoinById(id: string): Observable<Coin> {
    return this.http.get<Coin>(`/api/coins/${id}`);
  }

  deleteCoin(id: string): Observable<unknown> {
    return this.http.delete(`/api/coins/${id}`).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }

  createCoin(coin: Omit<Coin, 'id' | 'updatedAt'> ): Observable<Coin> {
    return this.http.post<Coin>("/api/coins", coin, httpOptions).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }

  editCoin(coin: Omit<Coin, 'updatedAt'>): Observable<Coin> {
    return this.http.post<Coin>(`/api/coins/${coin.id}`, coin, httpOptions).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }
}
