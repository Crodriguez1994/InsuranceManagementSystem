import { Component, signal } from '@angular/core';
import { Insurance } from './insurance.model';
import { GridConfig } from '../../../../shared/components/entity-grid/entity-grid.models';
import { InsurancesService } from './insurances.service';
import { EntityGridComponent } from '../../../../shared/components/entity-grid/entity-grid';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../../shared/services/confirm/confirm';
import { NotifyService } from '../../../../shared/services/notify/notify';
import { MatDialog } from '@angular/material/dialog';
import { InsuranceModalComponent, InsuranceModalMode } from './insurance-modal/insurance-modal';

@Component({
  selector: 'app-insurances',
  imports: [CommonModule, EntityGridComponent],
  templateUrl: './insurances.html',
  styleUrl: './insurances.scss',
})
export class Insurances {
  rows = signal<Insurance[]>([]);

  config: GridConfig<Insurance> = {
    title: 'Insurances',
    columns: [
      { key: 'code', header: 'Code' },
      { key: 'name', header: 'Name' },
      { key: 'insuredAmount', header: 'Insured Amount', cell: r => String(r.insuredAmount) },
      { key: 'price', header: 'Price', cell: r => String(r.price) },
      { key: 'status', header: 'Status', cell: r => r.status ? 'Active' : 'Inactive' }
    ],
    showCreate: true, showView: true, showEdit: true, showDelete: true
  }

  constructor(private api: InsurancesService,
    private dialog: MatDialog,
    private notify: NotifyService,
    private confirm: ConfirmService
  ) { this.load(); }

  load() {
    this.api.getAll().subscribe({
      next: d => this.rows.set(d),
      error: () => this.notify.error('Error loading insurances')
    });
  }

  openCreate() {
    const ref = this.dialog.open(InsuranceModalComponent, {
      width: '720px',
      data: { mode: 'create' as InsuranceModalMode }
    });

    ref.afterClosed().subscribe(payload => {
      if (!payload) return;

      this.api.create(payload).subscribe({
        next: () => { this.notify.success('Insurance created'); this.load(); },
        error: (err) => {
          if (err?.status === 409) this.notify.warn(err.error?.message ?? 'Code already exists');
          else this.notify.error('Error creating insurance');
        }
      });
    });
  }

  openEdit(row: Insurance) {
    const ref = this.dialog.open(InsuranceModalComponent, {
      width: '720px',
      data: { mode: 'edit' as InsuranceModalMode, insurance: row }
    });

    ref.afterClosed().subscribe(payload => {
      if (!payload) return;

      this.api.update(row.id, payload).subscribe({
        next: () => { this.notify.success('Insurance updated'); this.load(); },
        error: (err) => {
          if (err?.status === 409) this.notify.warn(err.error?.message ?? 'Code already exists');
          else this.notify.error('Error updating insurance');
        }
      });
    });
  }

  openView(row: Insurance) {
    this.dialog.open(InsuranceModalComponent, {
      width: '720px',
      data: { mode: 'view' as InsuranceModalMode, insurance: row }
    });
  }

  onDelete(row: Insurance) {
    this.confirm.ask({
      title: 'Delete insurance',
      message: `Are you sure you want to delete "${row.code} - ${row.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(ok => {
      if (!ok) return;

      this.api.delete(row.id).subscribe({
        next: () => { this.notify.success('Insurance deleted'); this.load(); },
        error: () => this.notify.error('Error deleting insurance')
      });
    });
  }
}
