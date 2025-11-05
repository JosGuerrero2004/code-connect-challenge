import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../../config/firebase'
import type { User, UserProfile } from '../types/auth'

export type UserProfileUpdates = {
  photoURL?: string
  displayName?: string
}

export type ProjectUpdates = {
  authorPhoto?: string
  authorDisplayName?: string
}

export type CommentUpdates = {
  photoUrl?: string
  displayName?: string
}

export type CascadeResult = {
  uid: string
  authorPhoto?: string
  authorDisplayName?: string
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userProfileRef = doc(db, 'users', uid)
    const userProfileDoc = await getDoc(userProfileRef)

    if (!userProfileDoc.exists()) {
      console.warn(`Perfil no encontrado para UID: ${uid}`)
      return null
    }

    const data = userProfileDoc.data()
    return {
      uid,
      ...data,
      likedProjects: {
        ids: data.likedProjects,
      },
      sharedProjects: {
        ids: data.sharedProjects,
      },

      createdAt: data.createdAt?.toDate().toISOString(),
    } as UserProfile
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error)
    return null
  }
}
interface CreateUserProfileData {
  username: string
  displayName: string
  bio: string
  photoURL: string | null
}

export async function createUserProfile(
  user: User,
  userProfileData?: CreateUserProfileData
): Promise<void> {
  if (!userProfileData) {
    userProfileData = {
      username: user.email?.split('@')[0],
      displayName: user.email?.split('@')[0],
      bio: '',
      photoURL: null,
    }
  }
  try {
    const userProfileRef = doc(db, 'users', user.uid)
    await setDoc(userProfileRef, {
      email: user.email,
      createdAt: serverTimestamp(),
      ...userProfileData,
      followers: 0,
      following: 0,
    })
  } catch (error) {
    console.error('Error al crear perfil del usuario:', error)
    throw error
  }
}

export const cascadeUserUpdate = async (
  uid: string,
  updates: { authorPhoto?: string; authorDisplayName?: string }
) => {
  const batch = writeBatch(db)

  // 1. Actualiza el perfil principal (solo campos definidos)
  const userRef = doc(db, 'users', uid)
  const userUpdates: UserProfileUpdates = {}
  if (updates.authorPhoto !== undefined) {
    userUpdates.photoURL = updates.authorPhoto
  }
  if (updates.authorDisplayName !== undefined) {
    userUpdates.displayName = updates.authorDisplayName
  }

  // Solo actualizar si hay cambios
  if (Object.keys(userUpdates).length > 0) {
    batch.update(userRef, userUpdates)
  }

  // 2. Actualiza proyectos creados por el usuario
  const projectsSnap = await getDocs(
    query(collection(db, 'projects'), where('authorId', '==', uid))
  )

  for (const projectDoc of projectsSnap.docs) {
    // Construir objeto de actualización para proyectos
    const projectUpdates: ProjectUpdates = {}
    if (updates.authorPhoto !== undefined) {
      projectUpdates.authorPhoto = updates.authorPhoto
    }
    if (updates.authorDisplayName !== undefined) {
      projectUpdates.authorDisplayName = updates.authorDisplayName
    }

    // Actualiza el proyecto solo si hay cambios
    if (Object.keys(projectUpdates).length > 0) {
      batch.update(projectDoc.ref, projectUpdates)
    }

    // 3. Actualiza comentarios dentro del proyecto
    const commentsRef = collection(projectDoc.ref, 'comments')
    const commentsSnap = await getDocs(query(commentsRef, where('userId', '==', uid)))

    commentsSnap.forEach((commentDoc) => {
      const commentUpdates: CommentUpdates = {}
      if (updates.authorPhoto !== undefined) {
        commentUpdates.photoUrl = updates.authorPhoto
      }
      if (updates.authorDisplayName !== undefined) {
        commentUpdates.displayName = updates.authorDisplayName
      }

      // Actualiza comentario solo si hay cambios
      if (Object.keys(commentUpdates).length > 0) {
        batch.update(commentDoc.ref, commentUpdates)
      }
    })
  }

  // 4. Ejecuta el batch
  await batch.commit()
}
