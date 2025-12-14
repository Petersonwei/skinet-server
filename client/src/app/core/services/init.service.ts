import { Injectable, inject } from '@angular/core';
import { of, forkJoin } from 'rxjs';
import { CartService } from './cart.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);

  init() {
    const cartId = localStorage.getItem('cart_id');

    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);
    const user$ = this.accountService.getUserInfo();

    return forkJoin({
      cart: cart$,
      user: user$
    });
  }
}
