import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';
import { loadStripe, Stripe, StripeElements, StripeAddressElement, StripeAddressElementOptions } from '@stripe/stripe-js';
import { firstValueFrom, map } from 'rxjs';
import { CartType } from '../../shared/models/cart';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripePromise?: Promise<Stripe | null>;
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  private cartService = inject(CartService);
  private elements?: StripeElements;
  addressElement?: StripeAddressElement;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  createOrUpdatePaymentIntent() {
    const cart = this.cartService.cart();
    if (!cart) throw new Error('Problem with cart');

    return this.http.post<CartType>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map(cart => {
        this.cartService.cart.set(cart);
        return cart;
      })
    );
  }

  async initializeElements() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements({
          clientSecret: cart.clientSecret,
          appearance: {
            labels: 'floating'
          }
        });
      } else {
        throw new Error('Stripe has not been loaded');
      }
    }
    return this.elements;
  }

  async createAddressElement() {
    if (!this.addressElement) {
      const elements = await this.initializeElements();
      if (elements) {
        const options: StripeAddressElementOptions = {
          mode: 'shipping'
        };
        this.addressElement = elements.create('address', options);
      } else {
        throw new Error('Elements instance has not been loaded');
      }
    }
    return this.addressElement;
  }
}
