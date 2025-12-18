import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { PaymentSummary } from '../models/order';

@Pipe({
  name: 'paymentCard',
  standalone: true
})
export class PaymentCardPipe implements PipeTransform {

  transform(value: ConfirmationToken['payment_method_preview'] | PaymentSummary | null | undefined): string {
    if (value && 'card' in value) {
      const { brand, last4, exp_month, exp_year } = (value as ConfirmationToken['payment_method_preview']).card!;
      const formattedBrand = brand?.toUpperCase() || 'CARD';
      return `${formattedBrand} **** **** **** ${last4} ${exp_month.toString().padStart(2, '0')}/${exp_year}`;
    } else if (value && 'last4' in value) {
      const { brand, last4, expMonth, expYear } = value as PaymentSummary;
      const formattedBrand = brand?.toUpperCase() || 'CARD';
      return `${formattedBrand} **** **** **** ${last4} ${expMonth.toString().padStart(2, '0')}/${expYear}`;
    }

    return 'Unknown payment method';
  }

}
