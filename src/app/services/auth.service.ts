import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getSessionId());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response.session_id) {
            this.setSessionId(response.session_id);
            this.isLoggedInSubject.next(true);
          }
        })
      );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('session_id');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getSessionId(): string | null {
    return localStorage.getItem('session_id');
  }

  setSessionId(sessionId: string): void {
    localStorage.setItem('session_id', sessionId);
  }

  checkAuthStatus(): boolean {
    const isLoggedIn = !!this.getSessionId();
    this.isLoggedInSubject.next(isLoggedIn);
    return isLoggedIn;
  }
} 