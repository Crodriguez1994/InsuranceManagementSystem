import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClientsService } from '../clients/clients.service';
import { ClientInsurancesService, InsuranceCheck } from './client-insurances.service';

import { Client } from '../clients/client.model';
import { NotifyService } from '../../../../shared/services/notify/notify';

@Component({
  selector: 'app-client-insurances',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './client-insurances.html',
  styleUrls: ['./client-insurances.scss']
})
export class ClientInsurancesComponent {
  clientsList: Client[] = [];
  insurances = signal<InsuranceCheck[]>([]);
  loading = signal(false);
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientsApi: ClientsService,
    private assignApi: ClientInsurancesService,
    private notify: NotifyService
  ) {
    this.loadClients();
    this.form = this.fb.group({
      clientId: [null as number | null, Validators.required]
    });
  }

  loadClients() {
    this.clientsApi.getAll().subscribe({
      next: d => {
        this.clientsList = d.filter(x => !x.isDeleted);
      },
      error: () => this.notify.error('Error loading clients')
    });
  }


  onClientChange() {
    const clientId = this.form.value.clientId;
    if (!clientId) return;

    this.loading.set(true);
    this.assignApi.getByClient(clientId).subscribe({
      next: d => { this.insurances.set(d); this.loading.set(false); },
      error: () => { this.notify.error('Error loading assignments'); this.loading.set(false); }
    });
  }

  toggle(item: InsuranceCheck, checked: boolean) {
    const updated = this.insurances().map(x =>
      x.insuranceId === item.insuranceId ? { ...x, assigned: checked } : x
    );
    this.insurances.set(updated);
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const clientId = this.form.value.clientId!;
    const selectedIds = this.insurances().filter(x => x.assigned).map(x => x.insuranceId);

    this.loading.set(true);
    this.assignApi.assign(clientId, selectedIds).subscribe({
      next: () => { this.notify.success('Assignments saved'); this.loading.set(false); },
      error: () => { this.notify.error('Error saving assignments'); this.loading.set(false); }
    });
  }
}
