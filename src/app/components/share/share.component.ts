import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  sharedItems: CartItem[] = [];
  shareUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['items']) {
        this.parseSharedItems(params['items']);
        this.shareUrl = window.location.href;
      }
    });
  }


  // Safe original code (commented out)
  /*
  private parseSharedItems(itemsParam: string): void {
    const params = new URLSearchParams(itemsParam);
    const items: CartItem[] = [];
    let currentItem: Partial<CartItem> = {};

    params.forEach((value, key) => {
      if (key === 'id') {
        if (Object.keys(currentItem).length > 0) {
          items.push(currentItem as CartItem);
        }
        currentItem = { id: parseInt(value, 10) };
      } else if (key === 'name') {
        // Safely decode and escape the name
        currentItem.name = this.escapeHtml(decodeURIComponent(value));
      }
    });

    if (Object.keys(currentItem).length > 0) {
      items.push(currentItem as CartItem);
    }

    this.sharedItems = items;
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  */

  // Unsafe code, vulnerable to XSS attacks
  private parseSharedItems(itemsParam: string): void {
    const params = new URLSearchParams(itemsParam);
    const items: CartItem[] = [];
    let currentItem: Partial<CartItem> = {};

    params.forEach((value, key) => {
      if (key === 'id') {
        if (Object.keys(currentItem).length > 0) {
          items.push(currentItem as CartItem);
        }
        currentItem = { id: parseInt(value, 10) };
      } else if (key === 'name') {
        // Directly use the decoded value without any filtering or escaping
        currentItem.name = decodeURIComponent(value);
      }
    });

    if (Object.keys(currentItem).length > 0) {
      items.push(currentItem as CartItem);
    }

    this.sharedItems = items;
  }

  // Method to bypass Angular's security checks
  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  copyShareLink(): void {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Copy failed:', err);
      alert('Copy failed, please manually copy the link');
    });
  }

  addAllToCart(): void {
    this.sharedItems.forEach(item => {
      this.cartService.addToCart(item).subscribe({
        error: (error) => console.error('Failed to add item:', error)
      });
    });
    alert('All items have been added to the cart!');
  }
}
