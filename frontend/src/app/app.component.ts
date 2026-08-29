import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <header class="flex-between" style="padding: 20px 0; border-bottom: 2px solid #dee2e6; margin-bottom: 20px;">
        <h1>🧴 KosmetikOn</h1>
        <nav>
          <a routerLink="/materials" routerLinkActive="active" style="margin-right: 15px; color: #007bff; text-decoration: none; font-weight: 500;">Raw Materials</a>
        </nav>
      </header>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`.active { font-weight: bold; }`]
})
export class AppComponent { }