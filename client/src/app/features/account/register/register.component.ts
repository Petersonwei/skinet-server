import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    JsonPipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackBarService);

  validationErrors?: string[];

  registerForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    password: ['']
  });

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snack.success('Registration successful. You can now log in');
        this.router.navigateByUrl('/account/login');
      },
      error: (errors) => {
        this.validationErrors = errors;
      }
    });
  }
}
