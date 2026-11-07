import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Chain } from '../models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ChainsService {
  private http = inject(HttpClient);

  getChains(): Observable<Chain[]> {
    return this.http.get<Chain[]>('/api/chains');
  }

  getChainById(id: string): Observable<Chain> {
    return this.http.get<Chain>(`/api/chains/${id}`);
  }

  deleteChain(id: string): Observable<unknown> {
    return this.http.delete(`/api/chains/${id}`).pipe(
              catchError((error) => {
                const message = error.error?.message || "Server error occurred";
                return throwError(() => new Error(message));
              })
            );
  }

  createChain(chain: Omit<Chain, 'id' | 'updatedAt'> ): Observable<Chain> {
    return this.http.post<Chain>("/api/chains", chain, httpOptions).pipe(
              catchError((error) => {
                const message = error.error?.message || "Server error occurred";
                return throwError(() => new Error(message));
              })
          );
  }

  editChain(chain: Omit<Chain, 'updatedAt'>): Observable<Chain> {
    return this.http.post<Chain>(`/api/chains/${chain.id}`, chain, httpOptions).pipe(
              catchError((error) => {
                const message = error.error?.message || "Server error occurred";
                return throwError(() => new Error(message));
              })
            );
  }
}
