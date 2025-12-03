import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

export interface Credential {
  email: string;
  password: string;
}

// Interface for video data stored in Firestore
export interface Video {
  id?: string; // Optional ID for document reference
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  readonly authState$: Observable<User | null> = authState(this.auth);

  // Definimos las colecciones
  private collections: Record<string, CollectionReference<Video>> = {
    maintenance: collection(this.firestore, 'maintenanceVideos') as CollectionReference<Video>,
    potenciacion: collection(this.firestore, 'potenciacionVideos') as CollectionReference<Video>,
    fabricacion: collection(this.firestore, 'fabricacionVideos') as CollectionReference<Video>,
    domotica: collection(this.firestore, 'domoticaVideos') as CollectionReference<Video>,
  };

  // --- Autenticación ---
  logInWithEmailAndPassword(credential: Credential): Promise<boolean> {
    return signInWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then(async (userCredential) => {
        const userId = userCredential.user.uid;
        console.log('✅ UID del usuario autenticado:', userId);
        return await this.checkUserRole(userId);
      })
      .catch((error) => {
        console.error('❌ Error al autenticar con Firebase:', error);
        throw error;
      });
  }

  async checkUserRole(userId: string): Promise<boolean> {
    const userRef = doc(this.firestore, `User/${userId}`);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData['rol'] === 'admin';
    }
    return false;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  logOut(): Promise<void> {
    return this.auth.signOut();
  }

  // --- 🔧 Métodos genéricos para manejar videos por sección ---
  private getCollection(section: 'maintenance' | 'potenciacion' | 'fabricacion' | 'domotica'): CollectionReference<Video> {
    return this.collections[section];
  }

  async getVideos(section: 'maintenance' | 'potenciacion' | 'fabricacion' | 'domotica'): Promise<Video[]> {
    const snapshot = await getDocs(this.getCollection(section));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async addVideo(section: 'maintenance' | 'potenciacion' | 'fabricacion' | 'domotica', videoData: { title: string; url: string }): Promise<DocumentReference> {
    return addDoc(this.getCollection(section), videoData);
  }

  async updateVideo(section: 'maintenance' | 'potenciacion' | 'fabricacion' | 'domotica', videoId: string, videoData: { title: string; url: string }): Promise<void> {
    const videoDocRef = doc(this.firestore, `${section}Videos/${videoId}`);
    await updateDoc(videoDocRef, videoData);
  }

  async deleteVideo(section: 'maintenance' | 'potenciacion' | 'fabricacion' | 'domotica', videoId: string): Promise<void> {
    const videoDocRef = doc(this.firestore, `${section}Videos/${videoId}`);
    await deleteDoc(videoDocRef);
  }
}