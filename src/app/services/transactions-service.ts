import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Transaction } from '../models/transaction-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private http = inject(HttpClient);

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/api/transactions');
  }

  getAssetTransactionsByAssetid(assetid: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`/api/transactions/asset/${assetid}`);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`/api/transactions/${id}`);
  }

  deleteTransaction(id: string): Observable<unknown> {
    return this.http.delete(`/api/transactions/${id}`).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'updatedAt'> ): Observable<Transaction> {
    return this.http.post<Transaction>("/api/transactions", transaction, httpOptions).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }

  editTransaction(transaction: Omit<Transaction, 'updatedAt'>): Observable<Transaction> {
    return this.http.post<Transaction>(`/api/transactions/${transaction.id}`, transaction, httpOptions).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }
}
