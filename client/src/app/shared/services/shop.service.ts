import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product';
import { Pagination } from '../models/pagination';

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

  getProducts(brands?: string[], types?: string[]) {
    let params = new HttpParams();

    params = params.append('pageSize', '20');

    if (brands && brands.length > 0) {
      params = params.append('brands', brands.join(','));
    }

    if (types && types.length > 0) {
      params = params.append('types', types.join(','));
    }

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', { params });
  }
}
