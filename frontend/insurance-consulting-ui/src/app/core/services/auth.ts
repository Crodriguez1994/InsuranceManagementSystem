import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  token: string;
  expiration: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  isLoggedIn = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  login(req: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, req)
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          this.isLoggedIn.set(true);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
