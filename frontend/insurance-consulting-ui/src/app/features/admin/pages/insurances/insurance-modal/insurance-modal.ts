import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Insurance } from '../insurance.model';



export type InsuranceModalMode = 'create' | 'edit' | 'view';

export interface InsuranceModalData {
  mode: InsuranceModalMode;
  insurance?: Insurance | null;
}

@Component({
  selector: 'app-insurance-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './insurance-modal.html',
  styleUrls: ['./insurance-modal.scss']
})
export class InsuranceModalComponent {
  mode: InsuranceModalMode;
  readOnly = false;
  title = '';

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<InsuranceModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: InsuranceModalData
  ) {
    this.mode = data.mode;
    this.readOnly = data.mode === 'view';

    this.title =
      data.mode === 'create' ? 'New Insurance' :
        data.mode === 'edit' ? 'Edit Insurance' : 'View Insurance';

    this.form = this.fb.group({
      id: [0],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      insuredAmount: [0, [Validators.required, Validators.min(0.00000001)]],
      price: [0, [Validators.required, Validators.min(0.00000001)]],
      status: [true, [Validators.required]]
    });

    if (data.insurance) {
      this.form.patchValue({
        id: data.insurance.id,
        code: data.insurance.code,
        name: data.insurance.name,
        insuredAmount: data.insurance.insuredAmount,
        price: data.insurance.price,
        status: data.insurance.status
      });
    }

    if (this.readOnly) this.form.disable({ emitEvent: false });
  }

  get f() { return this.form.controls as any; }

  close() { this.ref.close(null); }

  submit() {
    if (this.readOnly) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.ref.close(this.form.getRawValue());
  }
}
