import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';

@Component({
  selector: 'app-order',
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = [];

  ngOnInit() {
    this.orderService.getOrdersForUser().subscribe({
      next: (orders) => {
        this.orders = orders;
      }
    });
  }
}
