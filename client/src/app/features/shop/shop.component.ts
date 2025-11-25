import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { ProductItemComponent } from './product-item/product-item.component';
import { ShopService } from '../../shared/services/shop.service';

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
  private shopService = inject(ShopService);

  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
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
