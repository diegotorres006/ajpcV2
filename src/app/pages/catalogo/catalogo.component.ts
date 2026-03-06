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

  allProducts: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedProduct: any | null = null;
  indicesImagenes: { [key: number]: number } = {};

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

    this.filteredProducts.forEach((_, i) => {
      if (this.indicesImagenes[i] === undefined) {
        this.indicesImagenes[i] = 0;
      }
    });
  }

  filtrarPorCategoria(category: string): void {
    this.router.navigate(['/catalogo'], { queryParams: category ? { category } : {} });
  }

  selectProduct(product: any): void {
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  // AQUÍ ESTÁ EL CAMBIO: Ahora busca producto.fotos
  obtenerImagenUrl(producto: any, index: number): string {
    if (producto.fotos && producto.fotos.length > 0) {
      return producto.fotos[this.indicesImagenes[index] || 0];
    }
    return producto.foto || 'assets/logo.webp';
  }

  siguienteImagen(index: number, event: Event, max: number): void {
    event.stopPropagation();
    if (this.indicesImagenes[index] < max - 1) {
      this.indicesImagenes[index]++;
    } else {
      this.indicesImagenes[index] = 0;
    }
  }

  anteriorImagen(index: number, event: Event, max: number): void {
    event.stopPropagation();
    if (this.indicesImagenes[index] > 0) {
      this.indicesImagenes[index]--;
    } else {
      this.indicesImagenes[index] = max - 1;
    }
  }
}
