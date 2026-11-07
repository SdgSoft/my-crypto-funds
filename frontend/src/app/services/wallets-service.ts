import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Wallet } from '../models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class WalletsService {
  private http = inject(HttpClient);

  getWallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>('/api/wallets');
  }

  getWalletById(id: string): Observable<Wallet> {
    return this.http.get<Wallet>(`/api/wallets/${id}`);
  }

  deleteWallet(id: string): Observable<unknown> {
    return this.http.delete(`/api/wallets/${id}`).pipe(
                  catchError((error) => {
                    const message = error.error?.message || "Server error occurred";
                    return throwError(() => new Error(message));
                  })
                );
  }

  createWallet(wallet: Omit<Wallet, 'id' | 'updatedAt' | 'chainname'> ): Observable<Wallet> {
    return this.http.post<Wallet>("/api/wallets", wallet, httpOptions).pipe(
              catchError((error) => {
                const message = error.error?.message || "Server error occurred";
                return throwError(() => new Error(message));
              })
          );
  }

  editWallet(wallet: Omit<Wallet, 'updatedAt' | 'chainname'>): Observable<Wallet> {
    return this.http.post<Wallet>(`/api/wallets/${wallet.id}`, wallet, httpOptions).pipe(
              catchError((error) => {
                const message = error.error?.message || "Server error occurred";
                return throwError(() => new Error(message));
              })
          );
  }
}
