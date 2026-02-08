import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridConfig } from '../../../../shared/components/entity-grid/entity-grid.models';
import { UsersService } from './users.service';
import { User } from './user.model';
import { EntityGridComponent } from '../../../../shared/components/entity-grid/entity-grid';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent, UserModalMode } from './user-modal/user-modal';
import { ConfirmService } from '../../../../shared/services/confirm/confirm';
import { NotifyService } from '../../../../shared/services/notify/notify';


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
    private dialog: MatDialog,
    private notify: NotifyService,
    private confirm: ConfirmService
  ) {
    this.load();

  }

  load() { this.api.getAll().subscribe(d => this.rows.set(d)); }

  openCreate() {
    const ref = this.dialog.open(UserModalComponent, {
      width: '520px',
      data: { mode: 'create' }
    });

    ref.afterClosed().subscribe(payload => {
      if (!payload) return;

      this.api.create(payload).subscribe({
        next: () => {
          this.notify.success('User created successfully');
          this.load();
        },
        error: (err) => {
          if (err?.status === 409) this.notify.warn(err.error?.message ?? 'Username already exists');
          else this.notify.error('Error creating user');
        }
      });
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
      data: { mode: 'edit', user: row }
    });

    ref.afterClosed().subscribe(payload => {
      if (!payload) return;

      this.api.update(row.id, payload).subscribe({
        next: () => {
          this.notify.success('User updated successfully');
          this.load();
        },
        error: (err) => {
          if (err?.status === 409) this.notify.warn(err.error?.message ?? 'Username already exists');
          else this.notify.error('Error updating user');
        }
      });
    });
  }


  onDelete(row: User) {
    this.confirm.ask({
      title: 'Delete user',
      message: `Are you sure you want to delete "${row.username}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete_forever'
    }).subscribe(ok => {
      if (!ok) return;

      this.api.delete(row.id).subscribe({
        next: () => {
          this.notify.success('User deleted');
          this.load();
        },
        error: () => this.notify.error('Error deleting user')
      });
    });
  }

}
