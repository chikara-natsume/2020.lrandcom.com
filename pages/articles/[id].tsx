import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { api } from '~/api'
import Header from '~/components/article/Header'
import Button from '~/components/base/Button'
import Head from '~/components/base/Head'
import { usePageScroll } from '~/hooks/usePageScroll'
import { setSlug } from '~/store/header'
import { ArticleDetail } from '~/types'
import { config } from '~/utils/config'
// import { functions } from '~/utils/functions'
import { styles } from '~/utils/styles'

type ContainerProps = ArticleDetail & { id: string }
type ComponentProps = { className: string } & ContainerProps

const Component: React.FC<ComponentProps> = (props) => {
  const { asPath } = useRouter()
  const thumbnailUrl =
    props.thumbnail?.url || `${config.url.production}/images/base/ogp.png`

  const show = useMemo(() => {
    return (
      asPath !== '/articles/starbucks_founders' &&
      asPath !== '/articles/library' &&
      asPath !== '/articles/multi_potential'
    )
  }, [asPath])

  return (
    <div className={props.className}>
      <Head
        image={thumbnailUrl}
        title={`${props.title} / リーディング＆カンパニー株式会社`}
        type="article"
      />
      <Header
        className="header"
        publishedAt={props.published}
        thumbnail={thumbnailUrl}
        title={props.title}
      />
      {/* {show && (
        <div className="banner">
          <div className="title">【NEW】新しい本をリリースしました！</div>
          <div className="text">
            ５年後、あなたは４つの肩書を持つ。もう、ひとつの仕事にこだわり続ける人に未来はない。
          </div>
          <Link as="/articles/multi_potential" href="/articles/[id]">
            <a>
              <Button className="button">本の詳細はこちらから！！</Button>
            </a>
          </Link>
        </div>
      )} */}
      <div className="body" dangerouslySetInnerHTML={{ __html: props.body }} />
      {/* {show && (
        <div className="banner">
          <div className="title">【NEW】新しい本をリリースしました！</div>
          <div className="text">
            ５年後、あなたは４つの肩書を持つ。もう、ひとつの仕事にこだわり続ける人に未来はない。
          </div>
          <Link as="/articles/multi_potential" href="/articles/[id]">
            <a>
              <Button className="button">本の詳細はこちらから！！</Button>
            </a>
          </Link>
        </div>
      )} */}
    </div>
  )
}

const StyledComponent = styled(Component)`
  margin: 0 auto;
  padding-bottom: 15.5rem;
  ${styles.media.sp} {
    padding-bottom: 9.5rem;
  }
  > .header {
    width: 100%;
  }
  > .banner {
    font-size: 1.6rem;
    margin: 0 auto;
    width: 50rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 6rem 4rem;
    ${styles.media.sp} {
      width: calc(100% - 6rem);
    }
    > .title {
      font-weight: bold;
      letter-spacing: 0.2rem;
      transform: skew(-5deg);
    }
    > .text {
      margin-top: 4rem;
      opacity: 0.65;
      line-height: 2;
    }
    > a {
      display: inline-block;
      margin-top: 4rem;
    }
  }
  > .body {
    background: rgba(255, 255, 255, 0.05);
    padding: 6rem 3rem;
    margin: 0 auto;
    width: 50rem;
    overflow: hidden;
    font-size: 1.9rem;
    letter-spacing: 0.1rem;
    ${styles.media.sp} {
      width: 100%;
    }
    p {
      ${styles.mixins.lhCrop(2)}
      overflow: hidden;
      width: 100%;
    }
    span {
      opacity: 0.65;
    }
    img {
      margin: 0.75rem 0;
      width: 100%;
      opacity: 0.9;
    }
    a {
      text-decoration: underline;
    }
    blockquote {
      ${styles.mixins.lhCrop(2)}
      display: block;
      margin: 0;
      padding: 3rem;
      font-size: 1.4rem;
      background: #1c1c1e;
      border: 1px solid #222224;
    }
  }
`

const Container: React.FC<ContainerProps> = (props) => {
  const dispatch = useDispatch()
  dispatch(setSlug(`/${props.id.toUpperCase()}`))
  usePageScroll()
  return <StyledComponent className="article" {...props} />
}

export default Container

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id
  const { body, published, publishedAt, thumbnail, title } =
    await api.getArticle({
      id: (id as string) || '',
    })
  return {
    props: {
      body,
      id: id || '',
      published,
      publishedAt,
      thumbnail: thumbnail || { url: '' },
      title,
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
