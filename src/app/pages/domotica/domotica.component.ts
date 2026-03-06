import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { FormsModule } from '@angular/forms';

interface VideoDisplay {
  id?: string;
  title: string;
  rawUrl: string;
  sanitizedUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-domotica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './domotica.component.html',
  styles: []
})
export class DomoticaComponent implements OnInit {
  videos: VideoDisplay[] = [];
  isAdmin = false;
  showAdminSection = false;

  newVideoTitleForAdd = '';
  newVideoUrlForAdd = '';

  editingVideoId: string | null = null;
  currentVideoTitle = '';
  currentVideoUrl = '';

  private readonly section: string = 'domoticaVideos';

  constructor(private domSanitizer: DomSanitizer, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadVideos();
    this.authService.authState$.subscribe(async (user: User | null) => {
      this.isAdmin = user ? await this.authService.checkUserRole(user.uid) : false;
    });
  }

  private convertToEmbedUrl(url: string): string {
    if (!url) return '';
    if (url.includes('v=')) return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`;
    if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
    return url.includes('embed/') ? url : url;
  }

  async loadVideos(): Promise<void> {
    try {
      const firebaseVideos = await this.authService.getVideos(this.section);
      this.videos = firebaseVideos.map(video => ({
        id: video.id,
        title: video.title,
        rawUrl: video.url,
        sanitizedUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(video.url))
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async addVideo(): Promise<void> {
    if (!this.newVideoTitleForAdd || !this.newVideoUrlForAdd) return;
    await this.authService.addVideo(this.section, { title: this.newVideoTitleForAdd, url: this.convertToEmbedUrl(this.newVideoUrlForAdd) });
    this.newVideoTitleForAdd = ''; this.newVideoUrlForAdd = '';
    await this.loadVideos();
  }

  startEdit(video: VideoDisplay): void {
    this.editingVideoId = video.id || null;
    this.currentVideoTitle = video.title;
    this.currentVideoUrl = video.rawUrl;
  }

  cancelEdit(): void { this.editingVideoId = null; }

  async saveVideo(): Promise<void> {
    if (this.editingVideoId) {
      await this.authService.updateVideo(this.section, this.editingVideoId, {
        title: this.currentVideoTitle,
        url: this.convertToEmbedUrl(this.currentVideoUrl)
      });
      this.cancelEdit();
      await this.loadVideos();
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    if (confirm('¿Eliminar demostración de domótica?')) {
      await this.authService.deleteVideo(this.section, videoId);
      await this.loadVideos();
    }
  }

  toggleAdminSection(): void {
    this.showAdminSection = !this.showAdminSection;
  }
}
