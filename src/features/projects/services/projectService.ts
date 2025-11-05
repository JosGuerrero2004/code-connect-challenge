import type { Project } from '../../../features/projects/types'
import { collection, doc, getDoc, getDocs, query, QueryConstraint, where } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export async function fetchProjectsByUserIdFunc(authorId: string): Promise<Project[]> {
  const queryConstraints: QueryConstraint[] = []
  const projectsCollection = collection(db, 'projects')

  queryConstraints.push(where('authorId', '==', authorId))

  const q = query(projectsCollection, ...queryConstraints)

  const projectsDoc = await getDocs(q)

  const userProjects: Project[] = projectsDoc.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(),
    } as Project
  })

  return userProjects
}

export async function fetchProjectsByIds(ids: string[]): Promise<Project[]> {
  const projectDocs = await Promise.all(
    ids.map(async (id) => {
      const ref = doc(db, 'projects', id)
      const snapshot = await getDoc(ref)
      return snapshot.exists()
        ? ({
            id: snapshot.data().id,
            ...snapshot.data(),
            createdAt: snapshot.data().createdAt?.toDate().toISOString(),
          } as Project)
        : null
    })
  )

  return projectDocs.filter((project): project is Project => project !== null)
}

/**
 * Sube una imagen a Cloudinary y devuelve su URL pública.
 * @param file Archivo de imagen (File o Blob)
 * @returns URL de descarga de la imagen
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'codeconnect')

  const res = await fetch('https://api.cloudinary.com/v1_1/divyjjshl/image/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Error al subir imagen a Cloudinary')
  }

  const data = await res.json()
  return data.secure_url // URL pública de la imagen
}

/**
 * Extrae un conjunto único de tags desde una lista de proyectos.
 * @param projects Lista de proyectos
 * @returns lista de tags únicos
 */
export function getUniqueTags(projects: Project[]): string[] {
  return [...new Set(projects.flatMap((p) => p.tags))]
}
