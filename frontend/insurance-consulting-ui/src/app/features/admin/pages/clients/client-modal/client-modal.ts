import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Client } from '../client.model';

export type ClientModalMode = 'create' | 'edit' | 'view';

export interface ClientModalData {
  mode: ClientModalMode;
  client?: Client | null;
}

@Component({
  selector: 'app-client-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './client-modal.html',
  styleUrls: ['./client-modal.scss']
})
export class ClientModalComponent {
  mode: ClientModalMode;
  readOnly = false;
  title = '';
  saving = signal(false);

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ClientModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: ClientModalData
  ) {
    this.mode = data.mode;
    this.readOnly = data.mode === 'view';

    this.title =
      data.mode === 'create' ? 'New Client' :
      data.mode === 'edit' ? 'Edit Client' : 'View Client';

    this.form = this.fb.group({
      id: [0],
      identification: ['', [Validators.required, Validators.maxLength(20)]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: [''],
      age: [18, [Validators.required, Validators.min(0)]],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      status: [true, [Validators.required]]
    });

    if (data.client) {
      this.form.patchValue({
        id: data.client.id,
        identification: data.client.identification,
        firstName: data.client.firstName,
        lastName: data.client.lastName,
        phone: data.client.phone,
        age: data.client.age,
        email: data.client.email,
        status: data.client.status
      });
    }

    if (this.readOnly) {
      this.form.disable({ emitEvent: false });
    }
  }

  get f() { return this.form.controls as any; }

  close() { this.ref.close(null); }

  submit() {
    if (this.readOnly) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    const payload = {
      ...v,
      fullName: `${v.firstName} ${v.lastName}`.trim(),
      isDeleted: false
    };

    this.ref.close(payload);
  }
}
