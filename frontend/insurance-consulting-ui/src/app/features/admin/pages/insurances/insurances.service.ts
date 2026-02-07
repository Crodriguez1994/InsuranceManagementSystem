import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Insurance } from './insurance.model';

@Injectable({ providedIn: 'root' })
export class InsurancesService {
    private base = `${environment.apiUrl}/api/insurances`;

    constructor(private http: HttpClient) { }

    getAll() { return this.http.get<Insurance[]>(this.base); }
    getById(id: number) { return this.http.get<Insurance>(`${this.base}/${id}`); }
    create(dto: Partial<Insurance>) { return this.http.post<Insurance>(this.base, dto); }
    update(id: number, dto: Partial<Insurance>) { return this.http.put<void>(`${this.base}/${id}`, dto); }
    delete(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
