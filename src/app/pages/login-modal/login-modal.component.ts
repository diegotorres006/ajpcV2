import { Component, Output, EventEmitter, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styles: []
})
export class LoginModalComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  @Output() close = new EventEmitter<void>();

  login() {
    if (this.email && this.password) {
      this.authService.logInWithEmailAndPassword({ email: this.email, password: this.password })
        .then((isAdmin) => {
          if (isAdmin) {
            this.close.emit();
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    } else {
      alert('Credenciales incompletas');
    }
  }

  closeModal(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.close.emit();
    }
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
