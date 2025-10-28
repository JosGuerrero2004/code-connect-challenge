import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import type { User, UserProfile } from '../types/auth'

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


