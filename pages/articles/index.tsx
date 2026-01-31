import { GetStaticProps } from 'next'

import { api } from '~/api'
import ArticlesListPage, { PAGE_SIZE } from '~/components/articles/ArticlesListPage'

export default ArticlesListPage

export const getStaticProps: GetStaticProps = async () => {
  const { contents, totalCount, error } = await api.getArticles({
    fields: ['id', 'title', 'published', 'thumbnail'],
    filters: 'hide[equals]false',
    limit: PAGE_SIZE,
    offset: 0,
    orders: '-published',
  })
  if (error) {
    return {
      props: {
        articles: [],
        currentPage: 1,
        totalPages: 1,
      },
      revalidate: 60,
    }
  }
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
