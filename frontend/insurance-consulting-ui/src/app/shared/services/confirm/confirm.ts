import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog';
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  constructor(private dialog: MatDialog) {}

  ask(data: ConfirmDialogData) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data
    }).afterClosed().pipe(map(res => !!res));
  }
}
