import { Component, inject, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CheckoutService } from '../../../core/services/checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  imports: [MatRadioModule, CurrencyPipe],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutService = inject(CheckoutService);

  ngOnInit() {
    this.checkoutService.getDeliveryMethods().subscribe();
  }
}
