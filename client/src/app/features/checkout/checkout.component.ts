import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { AccountService } from '../../core/services/account.service';
import { StripeAddressElement, StripePaymentElement } from '@stripe/stripe-js';
import { Address } from '../../shared/models/user';
import { firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';

@Component({
  selector: 'app-checkout',
  imports: [OrderSummaryComponent, MatStepperModule, MatButtonModule, MatCheckboxModule, RouterLink, CheckoutDeliveryComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService);
  private snackBar = inject(SnackBarService);
  private accountService = inject(AccountService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
    } catch (error: any) {
      this.snackBar.error(error.message);
    }
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
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
  }

  private async getAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement!.getValue();
    const stripeAddress = result.value?.address;

    if (stripeAddress) {
      return {
        line1: stripeAddress.line1,
        line2: stripeAddress.line2 ?? undefined,
        city: stripeAddress.city,
        state: stripeAddress.state,
        country: stripeAddress.country,
        postalCode: stripeAddress.postal_code
      };
    }
    return null;
  }

  ngOnDestroy() {
    this.stripeService.disposeElements();
  }
}
