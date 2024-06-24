import { Injectable, inject, signal } from '@angular/core';
import { User } from '../../../typing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi = environment.apiUrl + '/auth/';
  private userApi = environment.apiUrl + '/users/';

  http = inject(HttpClient);
  router = inject(Router);

  currentUser = signal<undefined | null | User>(undefined);

  isAdmin(): boolean {
    if (this.currentUser()) {
      return this.currentUser()!.isAdmin;
    } else {
      return false;
    }
  }

  setCurrentUser() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.currentUser.set(null);
      return;
    }
    this.http.post(`${this.userApi}verify`, { token }).subscribe({
      next: (res: any) => {
        this.currentUser.set(res.data.user as User);
      },
      error: (err) => {
        localStorage.removeItem('auth_token');
        console.log(err);
      },
    });
  }

  register(registerObj: any) {
    return this.http.post<any>(`${this.authApi}register`, {
      user: registerObj,
    });
  }

  login(loginObj: any) {
    return this.http.post(`${this.authApi}login`, loginObj);
  }

  sendEmail(email: string) {
    return this.http.post(`${this.authApi}send-email`, { email });
  }

  resetPassword(resetObj: any) {
    return this.http.post(`${this.authApi}reset-password`, resetObj);
  }

  logOut() {
    localStorage.removeItem('auth_token');
    this.setCurrentUser();
    this.router.navigateByUrl('/login');
  }

  deleteAccount() {
    return this.http.post(`${this.userApi}delete`, {
      token: localStorage.getItem('auth_token'),
    });
  }
}
