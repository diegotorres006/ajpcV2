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
  selector: 'app-repotenciacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repotenciacion.component.html',
  styles: []
})
export class RepotenciacionComponent implements OnInit {
  videos: VideoDisplay[] = [];
  isAdmin = false;
  showAdminSection = false;

  newVideoTitleForAdd = '';
  newVideoUrlForAdd = '';

  editingVideoId: string | null = null;
  currentVideoTitle = '';
  currentVideoUrl = '';

  private readonly section: string = 'potenciacionVideos';

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
    return url;
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
    try {
      const embedUrl = this.convertToEmbedUrl(this.newVideoUrlForAdd);
      await this.authService.addVideo(this.section, { title: this.newVideoTitleForAdd, url: embedUrl });
      this.newVideoTitleForAdd = '';
      this.newVideoUrlForAdd = '';
      await this.loadVideos();
    } catch (error) {
      console.error(error);
    }
  }

  startEdit(video: VideoDisplay): void {
    this.editingVideoId = video.id || null;
    this.currentVideoTitle = video.title;
    this.currentVideoUrl = video.rawUrl;
  }

  cancelEdit(): void {
    this.editingVideoId = null;
    this.currentVideoTitle = '';
    this.currentVideoUrl = '';
  }

  async saveVideo(): Promise<void> {
    if (!this.currentVideoTitle || !this.currentVideoUrl || !this.editingVideoId) return;
    try {
      const embedUrl = this.convertToEmbedUrl(this.currentVideoUrl);
      await this.authService.updateVideo(this.section, this.editingVideoId, {
        title: this.currentVideoTitle,
        url: embedUrl
      });
      this.cancelEdit();
      await this.loadVideos();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    if (!confirm('¿Seguro que deseas eliminar este registro técnico?')) return;
    try {
      await this.authService.deleteVideo(this.section, videoId);
      await this.loadVideos();
    } catch (error) {
      console.error(error);
    }
  }

  toggleAdminSection(): void {
    this.showAdminSection = !this.showAdminSection;
  }
}
