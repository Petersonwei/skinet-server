import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe } from '@angular/common';
import { Location } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-order-summary',
  imports: [MatButton, RouterModule, MatFormField, MatLabel, MatInput, CurrencyPipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {
  cartService = inject(CartService);
  location = inject(Location);
}
