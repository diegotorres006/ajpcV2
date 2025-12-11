import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ProductoService } from '../../services/producto.service'; // Corrected import

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  imports: [CommonModule, FormsModule] // Add FormsModule here
})
export class CatalogoComponent implements OnInit {
  allProducts: Producto[] = [];
  filteredProducts: Producto[] = [];
  searchTerm: string = '';
  selectedCategory: string | null = null; // Property to store the selected category
  selectedProduct: Producto | null = null; // Property to store the selected product

  constructor(
    private productoService: ProductoService, // Inject ProductoService
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productoService.getProducto().subscribe({
      next: (products: Producto[]) => {
        this.allProducts = products;
        this.route.queryParams.subscribe(params => {
          if (params['category']) {
            this.selectedCategory = params['category'];
          }
          this.applyFilters(); // Apply filters initially
        });
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  // Method to apply both search term and category filters
  applyFilters(): void {
    let productsToDisplay = this.allProducts; // Start with all products

    // If a search term is present, apply it first to the entire list.
    // This ensures that the search results are independent of any selected category.
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      productsToDisplay = productsToDisplay.filter(product =>
        product.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.tipo.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.categoria.toLowerCase().includes(lowerCaseSearchTerm)
      );
      // When a search term is active, we display the search results directly.
      // The category filter is effectively ignored in this case.
      this.filteredProducts = productsToDisplay;
    } else {
      // If no search term is active, apply the category filter.
      if (this.selectedCategory !== null && this.selectedCategory !== '') {
        // Apply category filter to the full list
        this.filteredProducts = productsToDisplay.filter(product =>
          product.categoria.toLowerCase() === this.selectedCategory!.toLowerCase()
        );
      } else {
        // If no search term and no category selected, show all products
        this.filteredProducts = productsToDisplay;
      }
    }
  }

  // Method to handle search input
  search(): void {
    // Apply filters with the current search term.
    this.applyFilters();
    // Clear the search term after performing the search.
    // This allows category filters to be applied cleanly afterwards,
    // preventing the search term from interfering with category selection.
    this.searchTerm = '';
  }

  // Method to filter by category
  filtrarPorCategoria(category: string): void {
    this.selectedCategory = category;
    // When a category is selected, we re-apply filters.
    // The search term will be applied to all products, and then the selected category will filter those results.
    this.applyFilters();
  }

  // Categorías que quieres ocultar
private ocultarCategorias: string[] = [];

evitarCategorias(categorias: string[]): void {
  this.ocultarCategorias = categorias.map(c => c.toLowerCase());

  // Parche: usamos selectedCategory para forzar el refresco
  this.selectedCategory = ''; 
  this.applyFilters();

  // Filtramos DESPUÉS de applyFilters (sin modificarlo)
  this.filteredProducts = this.filteredProducts.filter((p: any) => {
    const cat = (p.categoria || '').toLowerCase();
    return !this.ocultarCategorias.includes(cat);
  });
}




  // Optional: Method to clear the category filter
  clearCategoryFilter(): void {
    this.selectedCategory = null;
    this.applyFilters();
  }

  // Method to select a product and show the modal
  selectProduct(product: Producto): void {
    this.selectedProduct = product;
  }

  // Method to close the modal
  closeModal(): void {
    this.selectedProduct = null;
  }
}
