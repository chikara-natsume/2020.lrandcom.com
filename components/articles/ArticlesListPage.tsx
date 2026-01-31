import Link from 'next/link'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import Article from '~/components/articles/Article'
import Head from '~/components/base/Head'
import { usePageScroll } from '~/hooks/usePageScroll'
import { StateTypes } from '~/store'
import { setSlug } from '~/store/header'
import { ArticleListItem } from '~/types'
import { config } from '~/utils/config'
import { styles } from '~/utils/styles'

export const PAGE_SIZE = 20

type ContainerProps = {
  articles: ArticleListItem[]
  currentPage: number
  totalPages: number
}
type Props = {
  className: string
  sp: boolean
} & ContainerProps

const buildPageHref = (page: number) =>
  page <= 1 ? '/articles' : `/articles/page/${page}`

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) pages.add(i)
  }
  return Array.from(pages).sort((a, b) => a - b)
}

const Pagination: React.FC<Pick<Props, 'currentPage' | 'totalPages'>> = (
  props
) => {
  if (props.totalPages <= 1) return null
  const pages = getPageNumbers(props.currentPage, props.totalPages)

  return (
    <nav className="pagination" aria-label="記事ページ">
      {props.currentPage > 1 ? (
        <Link href={buildPageHref(props.currentPage - 1)} prefetch={false}>
          <a className="nav">Prev</a>
        </Link>
      ) : (
        <span className="nav disabled">Prev</span>
      )}
      {pages.map((page, index) => {
        const prev = pages[index - 1]
        const showEllipsis = index > 0 && prev && page - prev > 1
        return (
          <React.Fragment key={page}>
            {showEllipsis && <span className="ellipsis">...</span>}
            {page === props.currentPage ? (
              <span className="current" aria-current="page">
                {page}
              </span>
            ) : (
              <Link href={buildPageHref(page)} prefetch={false}>
                <a>{page}</a>
              </Link>
            )}
          </React.Fragment>
        )
      })}
      {props.currentPage < props.totalPages ? (
        <Link href={buildPageHref(props.currentPage + 1)} prefetch={false}>
          <a className="nav">Next</a>
        </Link>
      ) : (
        <span className="nav disabled">Next</span>
      )}
    </nav>
  )
}

const Component: React.FC<Props> = (props) => (
  <div className={props.className}>
    <Head
      image={`${config.url.production}/images/base/ogp.png`}
      title={`記事を読む${
        props.currentPage > 1 ? ` ${props.currentPage}ページ目` : ''
      } / リーディング＆カンパニー株式会社`}
      type="website"
    />
    {props.articles.map((article, index) => (
      <React.Fragment key={article.id}>
        {props.sp && index > 0 && <div className="divider" />}
        <Article article={article} className="article" />
      </React.Fragment>
    ))}
    <Pagination currentPage={props.currentPage} totalPages={props.totalPages} />
    {props.sp && (
      <>
        <div className="divider" />
        <div className="divider" />
      </>
    )}
  </div>
)

const StyledComponent = styled(Component)`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 16rem auto;
  width: calc(100% - 15.7rem * 2);
  ${styles.media.sp} {
    display: block;
    margin: 9.5rem auto 0;
    width: calc(100% - 6rem);
  }
  .divider {
    ${styles.media.sp} {
      margin-top: 3rem;
      margin-left: -3rem;
      width: calc(100% + 6rem);
      height: 1px;
      background: white;
      opacity: 0.05;
    }
  }
  > .article:not(:nth-child(1)):not(:nth-child(2)) {
    margin-top: 10rem;
    ${styles.media.sp} {
      margin-top: 3rem;
    }
  }
  ${styles.media.sp} {
    > .article:nth-child(2) {
      margin-top: 3rem;
    }
  }
  > .article {
    width: 45%;
    ${styles.media.sp} {
      width: 100%;
    }
  }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8rem auto 0;
    width: 100%;
    gap: 1.2rem;
    font-size: 1.2rem;
    letter-spacing: 0.2rem;
    ${styles.media.sp} {
      margin: 5rem auto 0;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 1.3rem;
    }
    a,
    span {
      ${styles.mixins.flexCenter}
      min-width: 4.2rem;
      height: 3.4rem;
      padding: 0 1.2rem;
      border: 0.12rem solid rgba(255, 255, 255, 0.15);
      color: white;
      font-weight: bold;
      transform: skew(-3.5deg);
      background: rgba(255, 255, 255, 0.02);
    }
    a {
      opacity: 0.7;
      transition: opacity 0.2s ease, border-color 0.2s ease;
    }
    a:hover {
      opacity: 1;
      border-color: rgba(255, 255, 255, 0.4);
    }
    .current {
      opacity: 1;
      border-color: rgba(255, 255, 255, 0.55);
      background: rgba(255, 255, 255, 0.08);
    }
    .disabled {
      opacity: 0.2;
      pointer-events: none;
    }
    .ellipsis {
      border: none;
      background: transparent;
      opacity: 0.5;
    }
    .nav {
      min-width: 7.2rem;
      letter-spacing: 0.1rem;
    }
  }
`

const Container: React.FC<ContainerProps> = (props) => {
  const dispatch = useDispatch()
  dispatch(setSlug('/ARTICLES'))
  usePageScroll()
  const sp = useSelector((state: StateTypes) => state.media.sp)

  return <StyledComponent className="articles" sp={sp} {...props} />
}

export default Container
