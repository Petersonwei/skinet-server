import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card-pipe';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../shared/models/order';

@Component({
  selector: 'app-order-detailed',
  imports: [MatCardModule, MatButtonModule, RouterLink, DatePipe, CurrencyPipe, AddressPipe, PaymentCardPipe],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order?: Order;

  ngOnInit() {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.orderService.getOrderDetails(+id).subscribe({
      next: (order) => {
        this.order = order;
      }
    });
  }
}
