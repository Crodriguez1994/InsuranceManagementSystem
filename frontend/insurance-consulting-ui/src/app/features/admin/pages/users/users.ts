import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridConfig } from '../../../../shared/components/entity-grid/entity-grid.models';
import { UsersService } from './users.service';
import { User } from './user.model';
import { EntityGridComponent } from '../../../../shared/components/entity-grid/entity-grid';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent, UserModalMode } from './user-modal/user-modal';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, EntityGridComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent {
  rows = signal<User[]>([]);

  config: GridConfig<User> = {
    title: 'Users',
    columns: [
      { key: 'id', header: 'Id', cell: r => String(r.id) },
      { key: 'username', header: 'Username' },
      { key: 'status', header: 'Status', cell: r => r.status ? 'Active' : 'Inactive' }
    ],
    showCreate: true, showView: true, showEdit: true, showDelete: true
  };

  constructor(private api: UsersService,
    private dialog: MatDialog
  ) {
    this.load();

  }

  load() { this.api.getAll().subscribe(d => this.rows.set(d)); }

  openCreate() {
    const ref = this.dialog.open(UserModalComponent, {
      width: '520px',
      data: { mode: 'create' as UserModalMode }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.api.create(result).subscribe(() => this.load());
    });
  }
  openView(row: User) {
    this.dialog.open(UserModalComponent, {
      width: '520px',
      data: { mode: 'view' as UserModalMode, user: row }
    });

  }
  openEdit(row: User) {
    const ref = this.dialog.open(UserModalComponent, {
      width: '520px',
      data: { mode: 'edit' as UserModalMode, user: row }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.api.update(row.id, result).subscribe(() => this.load());
    });

  }

  onDelete(row: User) { this.api.delete(row.id).subscribe(() => this.load()); }
}
