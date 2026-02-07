import { Component, signal } from '@angular/core';
import { Insurance } from './insurance.model';
import { GridConfig } from '../../../../shared/components/entity-grid/entity-grid.models';
import { InsurancesService } from './insurances.service';
import { EntityGridComponent } from '../../../../shared/components/entity-grid/entity-grid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurances',
  imports: [CommonModule,EntityGridComponent],
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

  constructor(private api: InsurancesService) { this.load(); }
  
    load() { this.api.getAll().subscribe(d => this.rows.set(d)); }
  
    openCreate() { }
      openView(row: Insurance) { }
      openEdit(row: Insurance) { }
      onDelete(row: Insurance) { this.api.delete(row.id).subscribe(() => this.load()); }
}
