import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../services/producto.service'; // Corrected import
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, CommonModule,FormsModule, NgSelectModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  // Property to hold products fetched from Firebase
  allProducts: Producto[] = []; // Initialize as an empty array
  filteredProducts: Producto[] = [];
  selectedCategory: string = '';
  searchTerm: string = ''; // Add searchTerm property
  estado: string = ''; // Property for estado
  imagenActual: string = 'assets/ambu/Ambu1.png'; // Property for imagenActual, initialized with the first image
  private carouselInterval: any; // To store the interval ID

  // Get a reference to the video element
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // Images for the carousel from assets/ambu/
  private ambuImages: string[] = [
    'assets/ambu/Ambu1.png',
    'assets/ambu/Ambu2.png',
    'assets/ambu/Ambu3.png',
    'assets/ambu/Ambu4.png',
    'assets/ambu/Ambu5.png'
  ];
  private currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService // Inject ProductoService
  ) { }

  ngOnInit(): void {
    // Fetch products from Firebase
    this.productoService.getProducto().subscribe({ // Use object syntax for subscribe
      next: (products: Producto[]) => { // Explicitly type 'products'
        this.allProducts = products;
        this.filterProducts(); // Apply initial filtering after data is loaded
      },
      error: (err) => { // Handle potential errors
        console.error('Error fetching products:', err);
        // Optionally, set a default state or show an error message to the user
      }
    });

    this.route.queryParams.subscribe((params: Params) => {
      this.selectedCategory = params['propertyType'] || '';
      this.filterProducts(); // Re-filter if category changes via route params
    });
  }

  ngAfterViewInit(): void {
    // Initialize the carousel
    if (this.ambuImages.length > 0) {
      // this.imagenActual is already initialized with the first image in the class property
      this.carouselInterval = setInterval(() => {
        this.nextImage();
      }, 5000); // Change image every 5 seconds
    }

    // Programmatically mute the video
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
  const video = this.videoPlayer.nativeElement;

  video.muted = true;   
  video.volume = 0;     


  const playPromise = video.play?.();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
    
    });
  }
}

  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.ambuImages.length;
    this.imagenActual = this.ambuImages[this.currentImageIndex];
  }

  filterProducts(): void {
    let productsToFilter = this.allProducts;

    // Filter by category if selected
    if (this.selectedCategory) {
      productsToFilter = productsToFilter.filter((product: Producto) => product.categoria === this.selectedCategory);
    }

    // Filter by search term if entered
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      productsToFilter = productsToFilter.filter((product: Producto) =>
        product.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.descripcion.toLowerCase().includes(lowerCaseSearchTerm) || // Re-added description search
        product.categoria.toLowerCase().includes(lowerCaseSearchTerm) // Also search by category
      );
    }

    this.filteredProducts = productsToFilter;
  }

  // Method to handle search input changes
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.filterProducts();
  }

  // Method to handle button clicks for state changes
  onButtonClick(buttonType: string): void {
    this.estado = buttonType;
    this.filterProducts(); // Call filterProducts to update the view based on the new estado
  }

  // Method to navigate to the catalog page
  navigateToCatalogo(category: string): void {
    this.router.navigate(['/catalogo'], { queryParams: { category: category } });
  }
}
