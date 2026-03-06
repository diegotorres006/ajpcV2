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

export interface Video {
  id?: string;
  title: string;
  url: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  readonly authState$: Observable<User | null> = authState(this.auth);

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

  private getCollection(collectionName: string): CollectionReference<Video> {
    return collection(this.firestore, collectionName) as CollectionReference<Video>;
  }

  async getVideos(collectionName: string): Promise<Video[]> {
    const snapshot = await getDocs(this.getCollection(collectionName));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Video));
  }

  async addVideo(collectionName: string, videoData: { title: string; url: string; description?: string }): Promise<DocumentReference> {
    return addDoc(this.getCollection(collectionName), videoData);
  }

  async updateVideo(collectionName: string, videoId: string, videoData: { title: string; url: string; description?: string }): Promise<void> {
    const videoDocRef = doc(this.firestore, `${collectionName}/${videoId}`);
    await updateDoc(videoDocRef, videoData);
  }

  async deleteVideo(collectionName: string, videoId: string): Promise<void> {
    const videoDocRef = doc(this.firestore, `${collectionName}/${videoId}`);
    await deleteDoc(videoDocRef);
  }
}
