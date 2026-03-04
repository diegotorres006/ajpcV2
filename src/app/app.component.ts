import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { LoginModalComponent } from './pages/login-modal/login-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavbarComponent,
    FooterComponent,
    LoginModalComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = false;
  showLoginModal = false;
  showLayout = true;

  ngOnInit(): void {
    this.authService.authState$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.verificarAcceso(this.router.url);
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showLayout = !event.urlAfterRedirects.includes('/admin');
      this.verificarAcceso(event.urlAfterRedirects);
    });
  }

  verificarAcceso(url: string): void {
    const esAdmin = url.includes('/admin');

    if (esAdmin && !this.isLoggedIn) {
      this.openLoginModal();
    } else if (esAdmin && this.isLoggedIn) {
      this.showLoginModal = false;
    }
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
    if (!this.showLayout && !this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  cerrarSesion(): void {
    this.authService.logOut().then(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/home']);
    });
  }
}
