import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product';
import { Pagination } from '../models/pagination';
import { ShopParams } from '../models/shop-params';

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

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    params = params.append('pageSize', '20');

    if (shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }

    if (shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }

    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', { params });
  }
}
