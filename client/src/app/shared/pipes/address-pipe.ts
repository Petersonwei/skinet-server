import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { ShippingAddress } from '../models/order';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  transform(value: ConfirmationToken['shipping'] | ShippingAddress | null | undefined): string {
    if (value && 'address' in value && value.address) {
      const { line1, line2, city, state, country, postal_code } = value.address;
      return `${value.name}, ${line1}${line2 ? `, ${line2}` : ''}, ${city}, ${state}, ${postal_code}, ${country}`;
    } else if (value && 'line1' in value) {
      const { name, line1, line2, city, state, country, postalCode } = value as ShippingAddress;
      return `${name}, ${line1}${line2 ? `, ${line2}` : ''}, ${city}, ${state}, ${postalCode}, ${country}`;
    }

    return 'Unknown address';
  }

}
