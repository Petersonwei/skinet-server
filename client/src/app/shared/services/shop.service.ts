import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'http://localhost:5024/api/';
  types: string[] = [];
  brands: string[] = [];

  private http = inject(HttpClient);

  getBrands() {
    if (this.brands.length > 0) return;

    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: (response) => {
        this.brands = response;
      }
    });
  }

  getTypes() {
    if (this.types.length > 0) return;

    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: (response) => {
        this.types = response;
      }
    });
  }
}
