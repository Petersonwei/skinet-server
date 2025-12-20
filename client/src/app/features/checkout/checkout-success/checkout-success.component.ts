import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { SignalrService } from '../../../core/services/signalr.service';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card-pipe';

@Component({
  selector: 'app-checkout-success',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {
  signalrService = inject(SignalrService);
}
