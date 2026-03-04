import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input() isLoggedIn: boolean = false;
  @Output() onLogout = new EventEmitter<void>();
  @Output() onLogin = new EventEmitter<void>();

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);

    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }

    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(details => details.removeAttribute('open'));
  }
}
