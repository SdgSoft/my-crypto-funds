import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Asset } from '../models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private http = inject(HttpClient);

  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>('/api/assets');
  }

  getAssetById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`/api/assets/${id}`);
  }

  deleteAsset(id: string): Observable<unknown> {
    return this.http.delete(`/api/assets/${id}`).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }

  createAsset(asset: Omit<Asset, 'id' | 'updatedAt'> ): Observable<Asset> {
    return this.http.post<Asset>("/api/assets", asset, httpOptions).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }

  editAsset(asset: Omit<Asset, 'updatedAt'>): Observable<Asset> {
    return this.http.post<Asset>(`/api/assets/${asset.id}`, asset, httpOptions).pipe(
      catchError((error) => {
        const message = error.error?.message || "Server error occurred";
        return throwError(() => new Error(message));
      })
    );
  }
}
