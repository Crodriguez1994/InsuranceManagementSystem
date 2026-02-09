import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface InsuranceCheck {
  insuranceId: number;
  code: string;
  name: string;
  assigned: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientInsurancesService {
  private base = `${environment.apiUrl}/api/clientinsurances`;

  constructor(private http: HttpClient) {}

  getByClient(clientId: number) {
    return this.http.get<InsuranceCheck[]>(`${this.base}/client/${clientId}`);
  }

  assign(clientId: number, insuranceIds: number[]) {
    return this.http.post<void>(`${this.base}/assign`, { clientId, insuranceIds });
  }
}
