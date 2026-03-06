import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';

interface VideoDisplay {
  id?: string;
  title: string;
  description?: string;
  rawUrl: string;
  sanitizedUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mantenimiento.component.html'
})
export class MantenimientoComponent implements OnInit {
  private authService = inject(AuthService);
  private domSanitizer = inject(DomSanitizer);

  videos: VideoDisplay[] = [];

  ngOnInit(): void {
    this.loadVideos();
  }

  private convertToEmbedUrl(url: string): string {
    if (!url) return '';
    if (url.includes('v=')) return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`;
    if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
    return url;
  }

  async loadVideos(): Promise<void> {
    try {
      const firebaseVideos = await this.authService.getVideos('maintenanceVideos');
      this.videos = firebaseVideos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        rawUrl: video.url,
        sanitizedUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(video.url))
      }));
    } catch (error) {
      console.error(error);
    }
  }
}
