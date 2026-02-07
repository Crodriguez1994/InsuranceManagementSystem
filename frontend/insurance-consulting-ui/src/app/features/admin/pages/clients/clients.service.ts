import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Client } from './client.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
    private base = `${environment.apiUrl}/api/clients`;

    constructor(private http: HttpClient) { }

    getAll() { return this.http.get<Client[]>(this.base); }
    getById(id: number) { return this.http.get<Client>(`${this.base}/${id}`); }
    create(dto: Partial<Client>) { return this.http.post<Client>(this.base, dto); }
    update(id: number, dto: Partial<Client>) { return this.http.put<void>(`${this.base}/${id}`, dto); }
    delete(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
