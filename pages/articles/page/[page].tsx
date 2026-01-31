import { GetStaticPaths, GetStaticProps } from 'next'

import { api } from '~/api'
import ArticlesListPage, { PAGE_SIZE } from '~/components/articles/ArticlesListPage'

export default ArticlesListPage

export const getStaticProps: GetStaticProps = async (context) => {
  const rawPage = Array.isArray(context.params?.page)
    ? context.params?.page[0]
    : context.params?.page
  const parsed = Number(rawPage)
  if (
    !rawPage ||
    Number.isNaN(parsed) ||
    !Number.isFinite(parsed) ||
    parsed < 1 ||
    !Number.isInteger(parsed)
  ) {
    return { notFound: true, revalidate: 1800 }
  }
  const currentPage = Math.floor(parsed)
  if (currentPage === 1) {
    return {
      redirect: {
        destination: '/articles',
        permanent: false,
      },
      revalidate: 1800,
    }
  }
  const offset = (currentPage - 1) * PAGE_SIZE

  const { contents, totalCount, error } = await api.getArticles({
    fields: ['id', 'title', 'published', 'thumbnail'],
    filters: 'hide[equals]false',
    limit: PAGE_SIZE,
    offset,
    orders: '-published',
  })
  if (error) {
    return {
      redirect: {
        destination: '/articles',
        permanent: false,
      },
      revalidate: 60,
    }
  }
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  if (currentPage > totalPages) {
    return { notFound: true, revalidate: 1800 }
  }

  return {
    props: {
      articles: contents,
      currentPage,
      totalPages,
    },
    revalidate: 1800,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: 'blocking',
    paths: [],
  }
}
