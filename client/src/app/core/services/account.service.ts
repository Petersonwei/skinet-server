import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, Address } from '../../shared/models/user';
import { map, catchError, tap } from 'rxjs';
import { of } from 'rxjs';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'http://localhost:5024/api/';
  private http = inject(HttpClient);
  private signalrService = inject(SignalrService);
  currentUser = signal<User | null>(null);

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post(this.baseUrl + 'login', values, { params, withCredentials: true }).pipe(
      tap(() => {
        this.signalrService.createHubConnection();
      })
    );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info', { withCredentials: true }).pipe(
      map(user => {
        this.currentUser.set(user);
        return user;
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.signalrService.stopHubConnection();
      })
    );
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update(user => {
          if (user) {
            user.address = address;
          }
          return user;
        });
      })
    );
  }

  getAuthState() {
    return this.http.get<{isAuthenticated: boolean}>(this.baseUrl + 'account/auth-state');
  }
}
