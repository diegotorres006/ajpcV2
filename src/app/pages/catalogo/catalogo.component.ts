import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent implements OnInit {
  private productoService = inject(ProductoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  allProducts: Producto[] = [];
  filteredProducts: Producto[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedProduct: Producto | null = null;

  ngOnInit(): void {
    this.productoService.getProducto().subscribe({
      next: (products: Producto[]) => {
        this.allProducts = products;
        this.route.queryParams.subscribe(params => {
          this.selectedCategory = params['category'] || '';
          this.applyFilters();
        });
      },
      error: (err) => console.error(err)
    });
  }

  applyFilters(): void {
    let products = this.allProducts;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      products = products.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.tipo.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory !== '') {
      products = products.filter(p =>
        p.categoria.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    this.filteredProducts = products;
  }

  filtrarPorCategoria(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  selectProduct(product: Producto): void {
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }
}
