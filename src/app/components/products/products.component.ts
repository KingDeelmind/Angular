import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ReviewService, Review } from '../../services/review.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Product extends CartItem {
  reviews?: Review[];
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: "Smart Water Cup",
      price: "¥50.00",
      description: "This is a smart water cup suitable for people pursuing a healthy lifestyle.",
      image: "https://cbu01.alicdn.com/img/ibank/2018/874/280/8531082478_101075661.jpg"
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: "¥150.00",
      description: "Comfortable wireless headphones with excellent sound quality, offering you an ultimate auditory experience.",
      image: "https://th.bing.com/th/id/OIP.RVJZ2Nmvn24ILGPA7vAeTQHaHa?w=189&h=189&c=7&r=0&o=5&pid=1.7"
    },
    {
      id: 3,
      name: "Portable Coffee Machine",
      price: "¥200.00",
      description: "Portable coffee machine, enjoy delicious coffee anytime and anywhere.",
      image: "https://th.bing.com/th/id/R.34304f2899cb6b682b74018710cadaaf?rik=32eSHNyKn0Vfdg&riu=http%3a%2f%2ffiles.toodaylab.com%2f2014%2f10%2fwacaco_minipresso_20141005211451_00.jpg&ehk=RAvIECHrWAmmdU38ds4ToOXxqVPwlJmo7g1g1qFtqeY%3d&risl=&pid=ImgRaw&r=0"
    }
  ];

  reviews: Review[] = [];
  newReview: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    // Fetch all reviews
    this.reviewService.getAllReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => console.error('Failed to get reviews', error)
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        alert(`${product.name} has been added to the cart`);
      },
      error: (error) => {
        console.error("Failed to add to cart", error);
        alert("Failed to add to cart, please try again later");
      }
    });
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  submitReview(): void {
    if (!this.newReview.trim()) {
      return;
    }

    const newReviewContent = this.newReview;
    
    // Create a new review object, directly using the user's input
    const newReview: Review = {
      content: newReviewContent,  // Do not perform any filtering or escaping
      createdAt: new Date().toISOString(),
      username: 'Guest'
    };

    this.reviewService.addReview(newReviewContent).subscribe({
      next: () => {
        this.reviews = [newReview, ...this.reviews];
        this.newReview = '';
      },
      error: (error) => {
        console.error("Failed to add review", error);
        alert("Failed to add review, please try again later");
      }
    });
  }

  // Add a method to bypass Angular's security checks
  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
