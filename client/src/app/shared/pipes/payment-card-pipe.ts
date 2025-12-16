import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'paymentCard',
  standalone: true
})
export class PaymentCardPipe implements PipeTransform {

  transform(value: ConfirmationToken['payment_method_preview'] | null | undefined): string {
    if (value?.card) {
      const { brand, last4, exp_month, exp_year } = value.card;
      const formattedBrand = brand?.toUpperCase() || 'CARD';

      return `${formattedBrand} **** **** **** ${last4} ${exp_month.toString().padStart(2, '0')}/${exp_year}`;
    }

    return 'Unknown payment method';
  }

}
