import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  quantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:5000';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCart();
  }

  loadCart(): void {
    if (this.authService.getSessionId()) {
      this.getCart().subscribe({
        next: (items) => this.cartItemsSubject.next(items),
        error: (error) => console.error('Failed to load cart', error)
      });
    }
  }

  getCart(): Observable<CartItem[]> {
    const headers = this.getHeaders();
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart`, { headers });
  }

  addToCart(product: CartItem): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/cart`, product, { headers })
      .pipe(
        tap(() => {
          const currentItems = this.cartItemsSubject.value;
          this.cartItemsSubject.next([...currentItems, product]);
        })
      );
  }

  removeFromCart(itemId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/cart/${itemId}`, { headers })
      .pipe(
        tap(() => {
          const currentItems = this.cartItemsSubject.value;
          this.cartItemsSubject.next(
            currentItems.filter(item => item.id !== itemId)
          );
        })
      );
  }

  private getHeaders(): HttpHeaders {
    const sessionId = this.authService.getSessionId();
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionId}`
    });
  }

  getCurrentCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
}
