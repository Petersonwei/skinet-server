import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartService } from './cart.service';
import { CartType } from '../../shared/models/cart';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);

  init(): Observable<CartType | null> {
    const cartId = localStorage.getItem('cart_id');

    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return cart$;
  }
}
