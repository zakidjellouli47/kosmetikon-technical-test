import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RawMaterial, PaginatedResponse } from '../models/raw-material.model';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {
  private apiUrl = 'http://localhost:3000/api/raw-materials';

  constructor(private http: HttpClient) {}

  getMaterials(filters?: any): Observable<PaginatedResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  getMaterial(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createMaterial(material: RawMaterial): Observable<any> {
    return this.http.post(this.apiUrl, material);
  }

  updateMaterial(id: number, material: Partial<RawMaterial>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, material);
  }

  deleteMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}