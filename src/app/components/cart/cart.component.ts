import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { take } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems$ = this.cartService.cartItems$;
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cartService.loadCart();
    this.cartItems$.subscribe(items => {
      this.totalPrice = this.calculateTotal(items);
    });
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        // After successfully removing an item, cartItems$ will automatically update
      },
      error: (error) => {
        console.error('Failed to remove item', error);
        alert('Failed to remove item, please try again later');
      }
    });
  }

  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return total + price;
    }, 0);
  }

  shareCart(): void {
    this.cartItems$.pipe(take(1)).subscribe(items => {
      const queryParams = items
        .map((item: CartItem) => `id=${item.id}&name=${encodeURIComponent(item.name)}`)
        .join('&');
      
      this.router.navigate(['/share'], {
        queryParams: { items: queryParams }
      });
    });
  }

  checkout(): void {
    alert('The checkout feature is coming soon!');
  }
}
