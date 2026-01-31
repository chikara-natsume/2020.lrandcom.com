import { GetStaticProps } from 'next'

import { api } from '~/api'
import ArticlesListPage, { PAGE_SIZE } from '~/components/articles/ArticlesListPage'

export default ArticlesListPage

export const getStaticProps: GetStaticProps = async () => {
  const { contents, totalCount } = await api.getArticles({
    fields: ['id', 'title', 'published', 'thumbnail'],
    filters: 'hide[equals]false',
    limit: PAGE_SIZE,
    offset: 0,
    orders: '-published',
  })
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  return {
    props: {
      articles: contents,
      currentPage: 1,
      totalPages,
    },
    revalidate: 1800,
  }
}
