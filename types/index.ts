export type ArticleTypes = {
  body: string
  createdAt: string
  hide: boolean
  id: string
  published: string
  publishedAt: string
  thumbnail?: {
    url: string
  } | null
  title: string
  updatedAt: string
}

export type ArticleListItem = Pick<
  ArticleTypes,
  'id' | 'title' | 'published' | 'thumbnail'
>

export type ArticleDetail = Pick<
  ArticleTypes,
  'body' | 'published' | 'publishedAt' | 'thumbnail' | 'title'
>
