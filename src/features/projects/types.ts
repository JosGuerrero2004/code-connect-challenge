export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  author: string
  createdAt: string
  banner: string
}

export interface ProjectsState {
  items: Project[]
  filtered: Project[]
  loading: boolean
  error: string | null
  activeTags: string[]
}
