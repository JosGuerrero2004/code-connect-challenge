import { arrayRemove, arrayUnion, doc, getDoc, increment, updateDoc } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export async function toggleProjectLike(
  userId: string,
  projectId: string
): Promise<'liked' | 'unliked'> {
  const userRef = doc(db, 'users', userId)
  const projectRef = doc(db, 'projects', projectId)

  const userSnap = await getDoc(userRef)
  const projectSnap = await getDoc(projectRef)

  if (!userSnap.exists() || !projectSnap.exists()) {
    throw new Error('Usuario o proyecto no encontrado')
  }

  const userData = userSnap.data()
  const likedProjects: string[] = userData.likedProjects ?? []

  const alreadyLiked = likedProjects.includes(projectId)

  if (alreadyLiked) {
    await Promise.all([
      updateDoc(userRef, {
        likedProjects: arrayRemove(projectId),
      }),
      updateDoc(projectRef, {
        likes: increment(-1),
      }),
    ])
    return 'unliked'
  } else {
    await Promise.all([
      updateDoc(userRef, {
        likedProjects: arrayUnion(projectId),
      }),
      updateDoc(projectRef, {
        likes: increment(1),
      }),
    ])
    return 'liked'
  }
}

export async function toggleProjectShare(
  userId: string,
  projectId: string
): Promise<'shared' | 'unshared'> {
  const userRef = doc(db, 'users', userId)
  const projectRef = doc(db, 'projects', projectId)

  const userSnap = await getDoc(userRef)
  const projectSnap = await getDoc(projectRef)

  if (!userSnap.exists() || !projectSnap.exists()) {
    throw new Error('Usuario o proyecto no encontrado')
  }

  const userData = userSnap.data()
  const sharedProjects: string[] = userData.sharedProjects ?? []

  const alreadyShared = sharedProjects.includes(projectId)

  if (alreadyShared) {
    await Promise.all([
      updateDoc(userRef, {
        sharedProjects: arrayRemove(projectId),
      }),
      updateDoc(projectRef, {
        shares: increment(-1),
      }),
    ])
    return 'unshared'
  } else {
    await Promise.all([
      updateDoc(userRef, {
        sharedProjects: arrayUnion(projectId),
      }),
      updateDoc(projectRef, {
        shares: increment(1),
      }),
    ])
    return 'shared'
  }
}
