import { MICROCMS_KEY } from '~/lib/constants'
import { ArticleListItem } from '~/types'
import { request } from '~/utils/request'

type GetArticlesParams = {
  limit?: number
  offset?: number
  fields?: string[]
  filters?: string
  orders?: string
}

export type MicroCMSListResponse<T> = {
  contents: T[]
  totalCount: number
  limit: number
  offset: number
}

const buildQuery = (params: GetArticlesParams) => {
  const query = new URLSearchParams()
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.fields?.length) query.set('fields', params.fields.join(','))
  if (params.filters) query.set('filters', params.filters)
  if (params.orders) query.set('orders', params.orders)
  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

export default async (
  params: GetArticlesParams = {}
): Promise<MicroCMSListResponse<ArticleListItem>> => {
  const query = buildQuery(params)
  const response: MicroCMSListResponse<ArticleListItem> = await request.get(
    `/articles${query}`,
    {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_KEY },
    }
  )
  if (!response || !Array.isArray(response.contents)) {
    console.error('microCMS getArticles failed', response)
    return {
      contents: [],
      totalCount: 0,
      limit: params.limit ?? 0,
      offset: params.offset ?? 0,
    }
  }
  return {
    ...response,
    contents: response.contents.map((article) => ({
      ...article,
      thumbnail: article.thumbnail ?? null,
    })),
  }
}
