import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { SnackBarService } from '../services/snack-bar.service';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const snackBar = inject(SnackBarService);

  const cart = cartService.cart();

  if (cart && cart.items && cart.items.length > 0) {
    return true;
  } else {
    snackBar.error('Your cart is empty');
    router.navigateByUrl('/cart');
    return false;
  }
};
