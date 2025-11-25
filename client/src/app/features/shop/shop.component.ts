import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'app-shop',
  imports: [ProductItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  baseUrl = 'http://localhost:5024/api/';
  products: Product[] = [];

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseUrl + 'products?pageSize=20').subscribe({
      next: (response) => {
        this.products = response.data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
}
