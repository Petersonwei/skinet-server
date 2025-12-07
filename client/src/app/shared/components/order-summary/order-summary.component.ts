import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-order-summary',
  imports: [MatButton, RouterModule, MatFormField, MatLabel, MatInput],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {

}
