import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { RouterLink, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { StripeService } from '../../core/services/stripe.service';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { AccountService } from '../../core/services/account.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { StripeAddressElement, StripePaymentElement, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent, ConfirmationToken } from '@stripe/stripe-js';
import { Address } from '../../shared/models/user';
import { ShippingAddress, OrderToCreate } from '../../shared/models/order';
import { firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';

@Component({
  selector: 'app-checkout',
  imports: [OrderSummaryComponent, MatStepperModule, MatButtonModule, MatProgressSpinnerModule, MatCheckboxModule, RouterLink, CurrencyPipe, CheckoutDeliveryComponent, CheckoutReviewComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService);
  private snackBar = inject(SnackBarService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  confirmationToken?: ConfirmationToken;
  loading = false;

  completionStatus = signal<{address: boolean; card: boolean; delivery: boolean}>({
    address: false,
    card: false,
    delivery: false
  });

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
    } catch (error: any) {
      this.snackBar.error(error.message);
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    });
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state;
    });
  }

  handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    });
  }

  async getConfirmationToken() {
    if (Object.values(this.completionStatus()).every(status => status === true)) {
      try {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) {
          throw new Error(result.error.message);
        }
        this.confirmationToken = result.confirmationToken;
        console.log('Confirmation token:', this.confirmationToken);
      } catch (error: any) {
        this.snackBar.error(error.message);
      }
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeService.confirmPayment(this.confirmationToken);

        if (result.paymentIntent?.status === 'succeeded') {
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(this.orderService.createOrder(order));

          if (orderResult) {
            this.cartService.clearCart();
            this.cartService.selectedDelivery.set(null);
            this.router.navigateByUrl('/checkout/success');
          } else {
            throw new Error('Order creation failed');
          }
        } else if (result.error) {
          throw new Error(result.error.message);
        } else {
          throw new Error('Something went wrong');
        }
      }
    } catch (error: any) {
      this.snackBar.error(error.message || 'Something went wrong');
      stepper.previous();
    } finally {
      this.loading = false;
    }
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1 && this.saveAddress) {
      const address = await this.getAddressFromStripeAddress();
      if (address) {
        await firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this.cartService.cart();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview?.card;

    if (!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress) {
      throw new Error('Problem creating order');
    }

    return {
      cartId: cart.id,
      paymentSummary: {
        last4: card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress
    };
  }

  private async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement!.getValue();
    const stripeAddress = result.value?.address;

    if (stripeAddress) {
      return {
        name: result.value?.name,
        line1: stripeAddress.line1,
        line2: stripeAddress.line2 ?? undefined,
        city: stripeAddress.city,
        state: stripeAddress.state,
        country: stripeAddress.country,
        postalCode: stripeAddress.postal_code
      } as Address;
    }
    return null;
  }

  ngOnDestroy() {
    this.stripeService.disposeElements();
  }
}
