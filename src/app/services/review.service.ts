import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Review {
  id?: number;
  username?: string;
  content: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/comments`);
  }

  addReview(content: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/comments`, { content }, { headers });
  }

  private getHeaders(): HttpHeaders {
    const sessionId = this.authService.getSessionId();
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionId}`
    });
  }
} 