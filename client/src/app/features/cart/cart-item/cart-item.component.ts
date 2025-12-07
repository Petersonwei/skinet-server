import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../../shared/models/cart';

@Component({
  selector: 'app-cart-item',
  imports: [RouterModule, MatButton, MatIconButton, MatIcon, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
}
