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
  code: string
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

export interface CommentsState {
  projectId: string
  comments: CommentNode[]
  error: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

export interface CommentNode {
  id: string
  content: string
  createdAt: string
  userId: string
  username: string
  photoURL: string
  replies: CommentNode[]
  replyingTo?: string | null
  replyingToUsername?: string | null
}
