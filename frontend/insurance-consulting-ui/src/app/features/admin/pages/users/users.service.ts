import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private base = `${environment.apiUrl}/api/users`;

    constructor(private http: HttpClient) { }

    getAll() { return this.http.get<User[]>(this.base); }
    getById(id: number) { return this.http.get<User>(`${this.base}/${id}`); }

    create(dto: Partial<User> & { username: string; password: string; }) {
        return this.http.post<User>(this.base, dto);
    }

    update(id: number, dto: Partial<User>) {
        return this.http.put<void>(`${this.base}/${id}`, dto);
    }

    delete(id: number) {
        return this.http.delete<void>(`${this.base}/${id}`);
    }
}
