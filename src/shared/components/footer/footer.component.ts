import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  private sanitizer = inject(DomSanitizer);

  public currentYear: number = 2026;
  public devName: string = 'Juan Diego Torres';
  public devPhone: string = '+593 999 734 486';
  public devEmail: string = 'jtorresm14@est.ups.edu.ec';

  public jpcPhone: string = '+593 998 683 511';
  public jpcFacebook: string = 'JPC ELECTRONICS';
  public googleMapsSearch: string = 'https://www.google.com/maps/search/?api=1&query=Euclides+y+Esquilo,+Cuenca,+Ecuador';

  public mapEmbedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.72749!2d-79.030999!3d-2.888999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd3cf227b36605%3A0xc477121c944eb3f4!2sEuclides%20y%20Esquilo%2C%20Cuenca!5e0!3m2!1ses-419!2sec!4v1740999999999!5m2!1ses-419!2sec'
  );
}
