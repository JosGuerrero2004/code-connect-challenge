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
  viewed: Project[]
  error: string | null
  activeTags: string[]
  selectedProject: Project | null
  hasFetched: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}
