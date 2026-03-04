import { Injectable, inject , NgZone} from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, docData, updateDoc} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { Storage, ref, listAll, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';
import { addDoc } from 'firebase/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { query, where, getDocs } from 'firebase/firestore';
import { Producto } from '../../models/producto';


@Injectable({ providedIn: 'root' })
export class ProductoService { // Renamed from PropertyService to ProductoService
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private auth = inject(Auth);
  private ngZone = inject(NgZone);  // 👈 inyectamos NgZone


  getProducto(): Observable<Producto[]> {
    const productoRef = collection(this.firestore, 'Productos');
    return collectionData(productoRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  getImagenesProductoRef(folderPath: string): Observable<string[]> {
    if (!folderPath) return from([[]]);
    const folderRef = ref(this.storage, folderPath);

    return from(listAll(folderRef)).pipe(
      switchMap(result => {
        const item = result.items[0];
        return item
          ? from(getDownloadURL(item)).pipe(map(url => [url]))
          : from([[]]);
      })
    );
  }


  getProductoRefPorId(id: string) {
    const docRef = doc(this.firestore, 'Productos', id); // Changed 'Producto' to 'Productos'
    return docData(docRef) as Observable<Producto>;
  }

  actualizarProducto(id: string, data: any) {
    const docRef = doc(this.firestore, 'Productos', id); // Changed 'Producto' to 'Productos'
    return updateDoc(docRef, data);
  }

  eliminarProducto(id: string) {
    // Delete the storage image (if any) then delete the Firestore document
    const docRef = doc(this.firestore, 'Productos', id);
    return (async () => {
      try {
        const producto = await firstValueFrom(docData(docRef) as Observable<any>);
        const fotoPath = producto?.fotoPath;
        if (fotoPath) {
          try {
            await this.deleteFile(fotoPath);
          } catch (err) {
            console.warn('eliminarProducto: could not delete storage file', fotoPath, err);
            // continue to delete document even if storage deletion failed
          }
        }
      } catch (err) {
        console.warn('eliminarProducto: could not read product before delete', err);
      }

      return deleteDoc(docRef);
    })();
  }


  actualizarImagenesProducto(id: string, nuevasImagenes: string[]) {
    const docRef = doc(this.firestore, 'Productos', id); // Changed 'Producto' to 'Productos'
    return updateDoc(docRef, {
      imagenes: nuevasImagenes
    });
  }

  verificarCodigoExiste(codigo: string): Promise<boolean> {
    const codigoNormalizado = codigo.trim().toLowerCase();
    const propiedadesRef = collection(this.firestore, 'Productos'); // Changed 'Producto' to 'Productos'
    const consulta = query(propiedadesRef, where('IPD', '==', codigoNormalizado));
    return getDocs(consulta).then(snapshot => !snapshot.empty);
  }

  crearProducto(producto: Producto): Promise<void> {
    const propiedadesRef = collection(this.firestore, 'Productos'); // Changed 'Producto' to 'Productos'

    return addDoc(propiedadesRef, {
      ...producto,
      // Removed ImagenFolder as it's not directly related to the 'foto' URL and producto.id would be undefined here.
    }).then(() => {});
  }

  // Delete a file from Firebase Storage by its full path (e.g., 'productos/12345_file.webp')
  async deleteFile(filePath: string): Promise<void> {
    if (!filePath) return;
    try {
      const fileRef = ref(this.storage, filePath);
      // Log current auth state to help diagnose permission issues
      try {
        const user = this.auth.currentUser;
        console.log('deleteFile: currentUser uid=', user?.uid);
        if (user && typeof (user as any).getIdToken === 'function') {
          try {
            const token = await (user as any).getIdToken();
            console.log('deleteFile: idToken (first 40 chars)=', token?.substring?.(0,40));
          } catch (tErr) {
            console.warn('deleteFile: could not get idToken', tErr);
          }
        }
      } catch (logErr) {
        console.warn('deleteFile: auth logging error', logErr);
      }

      await deleteObject(fileRef);
    } catch (error) {
      console.warn('deleteFile: could not delete storage object', filePath, error);
      // Re-throw if you want calling code to handle errors:
      throw error;
    }
  }





}
