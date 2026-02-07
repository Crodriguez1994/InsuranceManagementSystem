import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type UserModalMode = 'create' | 'edit' | 'view';

export interface UserModalData {
  mode: UserModalMode;
  user?: { id: number; username: string; status: boolean } | null;
}

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-modal.html',
  styleUrls: ['./user-modal.scss']
})
export class UserModalComponent {
  mode: UserModalMode;
  readOnly = false;
  title = '';

  saving = signal(false);
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: UserModalData
  ) {
    this.mode = data.mode;
    this.readOnly = data.mode === 'view';

    this.title =
      data.mode === 'create' ? 'New User' :
        data.mode === 'edit' ? 'Edit User' : 'View User';

    this.form = this.fb.group({
      id: [0],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(255)]],
      status: [true, [Validators.required]]
    });

    if (data.user) {
      this.form.patchValue({
        id: data.user.id,
        username: data.user.username,
        status: data.user.status
      });

    }

    if (this.readOnly) {
      this.form.disable({ emitEvent: false });
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  submit() {
    if (this.readOnly) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    // En edit si password viene vacío, no lo mandamos (para no resetear)
    const payload: any = {
      id: v.id,
      username: v.username,
      status: v.status
    };

    if (this.mode === 'create') payload.password = v.password;
    if (this.mode === 'edit' && v.password) payload.password = v.password;

    this.dialogRef.close(payload);
  }
}
