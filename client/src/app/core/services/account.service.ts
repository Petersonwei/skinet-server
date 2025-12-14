import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, Address } from '../../shared/models/user';
import { map, catchError } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'http://localhost:5024/api/';
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post(this.baseUrl + 'login', values, { params, observe: 'response', withCredentials: true }).pipe(
      map(response => {
        console.log('Login API successful:', response.status);
        console.log('Response headers:', response.headers.keys().map(key => `${key}: ${response.headers.get(key)}`));
        console.log('Set-Cookie headers:', response.headers.getAll('set-cookie'));
        return null;
      })
    );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info', { observe: 'response', withCredentials: true }).pipe(
      map(response => {
        console.log('getUserInfo successful:', response.status);
        console.log('getUserInfo body:', response.body);
        const user = response.body!;
        this.currentUser.set(user);
        return user;
      }),
      catchError(error => {
        console.log('getUserInfo failed:', error.status, error.statusText);
        console.log('getUserInfo error details:', error.error);
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'logout', {}, { withCredentials: true });
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address);
  }
}
