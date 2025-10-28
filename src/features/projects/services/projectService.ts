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
