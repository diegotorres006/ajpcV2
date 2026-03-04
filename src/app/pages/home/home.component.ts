import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  imagenActual: string = 'assets/ambu/Ambu1.webp';
  private carouselInterval: any;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  private ambuImages: string[] = [
    'assets/ambu/Ambu1.webp',
    'assets/ambu/Ambu2.webp',
    'assets/ambu/Ambu3.webp',
    'assets/ambu/Ambu4.webp',
    'assets/ambu/Ambu5.webp'
  ];
  private currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.ambuImages.length > 0) {
      this.carouselInterval = setInterval(() => this.nextImage(), 5000);
    }

    if (this.videoPlayer?.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      video.muted = true;
      video.volume = 0;
      // Prevenimos que el video intente cargar agresivamente
      video.play().catch(() => {});
    }
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.ambuImages.length;
    this.imagenActual = this.ambuImages[this.currentImageIndex];
  }

  navigateToCatalogo(category: string): void {
    this.router.navigate(['/catalogo'], { queryParams: { category: category } });
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
