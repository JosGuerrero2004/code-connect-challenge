export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  banner?: string
  authorId: string
  authorUsername: string
  authorDisplayName: string
  authorPhoto: string
  likes: number
  commentsCount: number
  shares: number
  createdAt: string
}

export interface ProjectsState {
  items: Project[]
  filtered: Project[]
  loading: boolean
  error: string | null
  activeTags: string[]
}
