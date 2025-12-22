import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chain } from '../models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ChainsService {

  constructor(private http: HttpClient) {

  }

  getChains(): Observable<Chain[]> {
    return this.http.get<Chain[]>('/api/chains');
  }

  getChainById(id: string): Observable<Chain> {
    return this.http.get<Chain>(`/api/chains/${id}`);
  }

  deleteChain(id: string): Observable<any> {
    return this.http.delete(`/api/chains/${id}`);
  }

  createChain(chain: Omit<Chain, 'id' | 'updatedAt'> ): Observable<Chain> {
    return this.http.post<Chain>("/api/chains", chain, httpOptions);
  }

  editChain(chain: Omit<Chain, 'updatedAt'>): Observable<Chain> {
    return this.http.post<Chain>(`/api/chains/${chain.id}`, chain, httpOptions);
  }
}
