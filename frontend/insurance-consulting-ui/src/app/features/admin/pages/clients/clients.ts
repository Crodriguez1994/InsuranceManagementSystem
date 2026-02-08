import { Component, signal } from '@angular/core';
import { Client } from './client.model';
import { GridConfig } from '../../../../shared/components/entity-grid/entity-grid.models';
import { EntityGridComponent } from '../../../../shared/components/entity-grid/entity-grid';
import { CommonModule } from '@angular/common';
import { ClientsService } from './clients.service';
import { ConfirmService } from '../../../../shared/services/confirm/confirm';
import { NotifyService } from '../../../../shared/services/notify/notify';
import { MatDialog } from '@angular/material/dialog';
import { ClientModalComponent, ClientModalMode } from './client-modal/client-modal';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, EntityGridComponent],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients {
  rows = signal<Client[]>([]);

  config: GridConfig<Client> = {
    title: 'Clients',
    columns: [
      { key: 'identification', header: 'Identification' },
      { key: 'fullName', header: 'Full Name' },
      { key: 'phone', header: 'Phone' },
      { key: 'age', header: 'Age', cell: r => String(r.age) },
      { key: 'email', header: 'Email' },
      { key: 'status', header: 'Status', cell: r => r.status ? 'Active' : 'Inactive' }
    ],
    showCreate: true, showView: true, showEdit: true, showDelete: true
  };

  constructor(private api: ClientsService,
    private dialog: MatDialog,
    private notify: NotifyService,
    private confirm: ConfirmService) {
    this.load();
  }

  load() {
    this.api.getAll().subscribe({
      next: d => this.rows.set(d.filter(x => !x.isDeleted)),
      error: () => this.notify.error('Error loading clients')
    });
  }

  openCreate() {
    const ref = this.dialog.open(ClientModalComponent, {
      width: '720px',
      data: { mode: 'create' as ClientModalMode }
    });

    ref.afterClosed().subscribe(payload => {
      if (!payload) return;

      this.api.create(payload).subscribe({
        next: () => { this.notify.success('Client created'); this.load(); },
        error: (err) => {
          if (err?.status === 409) this.notify.warn(err.error?.message ?? 'Identification already exists');
          else this.notify.error('Error creating client');
        }
      });
    });
  }

  openEdit(row: Client) {
    const ref = this.dialog.open(ClientModalComponent, {
      width: '720px',
      data: { mode: 'edit' as ClientModalMode, client: row }
    });

    ref.afterClosed().subscribe(payload => {
      if (!payload) return;

      this.api.update(row.id, payload).subscribe({
        next: () => { this.notify.success('Client updated'); this.load(); },
        error: (err) => {
          if (err?.status === 409) this.notify.warn(err.error?.message ?? 'Identification already exists');
          else this.notify.error('Error updating client');
        }
      });
    });
  }

  openView(row: Client) {
    this.dialog.open(ClientModalComponent, {
      width: '720px',
      data: { mode: 'view' as ClientModalMode, client: row }
    });
  }

  onDelete(row: Client) {
    this.confirm.ask({
      title: 'Delete client',
      message: `Are you sure you want to delete "${row.fullName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(ok => {
      if (!ok) return;

      this.api.delete(row.id).subscribe({
        next: () => { this.notify.success('Client deleted'); this.load(); },
        error: () => this.notify.error('Error deleting client')
      });
    });
  }
}
