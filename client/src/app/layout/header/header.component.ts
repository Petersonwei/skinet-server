import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatBadge } from '@angular/material/badge';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    MatProgressBar,
    RouterModule
  ]
})
export class HeaderComponent {
  busyService = inject(BusyService);
}
