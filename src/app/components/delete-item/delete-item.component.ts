import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.css']
})
export class DeleteItemComponent {
  itemId: number = 0;

  constructor(private http: HttpClient) {}

  deleteItem(): void {
    if (!this.itemId) {
      alert('请输入商品ID');
      return;
    }

    this.http.delete(`http://127.0.0.1:5000/cart/${this.itemId}`).subscribe({
      next: () => {
        alert(`商品ID ${this.itemId} 已成功删除`);
      },
      error: (error) => {
        console.error('删除商品失败', error);
        alert('删除商品失败，请稍后重试');
      }
    });
  }
} 