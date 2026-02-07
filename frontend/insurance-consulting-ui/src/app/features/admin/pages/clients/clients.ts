import { Component, signal } from '@angular/core';
import { Client } from './client.model';
import { GridConfig } from '../../../../shared/components/entity-grid/entity-grid.models';
import { EntityGridComponent } from '../../../../shared/components/entity-grid/entity-grid';
import { CommonModule } from '@angular/common';
import { ClientsService } from './clients.service';

@Component({
  selector: 'app-clients',
  imports: [CommonModule,EntityGridComponent],
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

  constructor(private api: ClientsService) { this.load(); }

  load() { this.api.getAll().subscribe(d => this.rows.set(d)); }

  openCreate() { }
    openView(row: Client) { }
    openEdit(row: Client) { }
    onDelete(row: Client) { this.api.delete(row.id).subscribe(() => this.load()); }
}
