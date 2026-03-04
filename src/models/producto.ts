export interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  categoria: string; // Maps to Firebase 'categoria'
  tipo: string;     // Maps to Firebase 'tipo'
  foto: string;      // URL pública de la imagen
  fotoPath?: string; // Ruta en Storage (ej: 'productos/12345_img.webp') para poder eliminar/reemplazar

}
