import { MICROCMS_KEY } from '~/lib/constants'
import { ArticleDetail } from '~/types'
import { request } from '~/utils/request'

export default async ({ id }: { id: string }): Promise<ArticleDetail> => {
  const article = await request.get(
    `/articles/${id}?fields=body,published,publishedAt,thumbnail,title`,
    {
      headers: { 'X-MICROCMS-API-KEY': MICROCMS_KEY },
    }
  )
  return article
}
