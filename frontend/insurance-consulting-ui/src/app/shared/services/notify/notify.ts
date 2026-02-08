import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type NotifyType = 'success' | 'error' | 'info' | 'warn';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  constructor(private snack: MatSnackBar) {}

  show(message: string, type: NotifyType = 'info', durationMs = 3000) {
    this.snack.open(message, 'OK', {
      duration: durationMs,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snack-${type}`]
    });
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error', 4500); }
  info(message: string) { this.show(message, 'info'); }
  warn(message: string) { this.show(message, 'warn'); }
}
