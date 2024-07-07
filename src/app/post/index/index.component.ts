import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  posts: Post[] = [];

  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAll().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        console.log(this.posts);
      },
      error: (e) => console.error('Error loading posts:', e)
    });
  }

  deletePost(id: number): void {
    this.postService.delete(id).subscribe({
      next: () => {
        this.posts = this.posts.filter(item => item.id !== id);
        console.log('Post deleted successfully!');
      },
      error: (e) => console.error('Error deleting post:', e)
    });
  }
}
