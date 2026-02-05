import Image from 'next/image'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'

import { useEffectAsync } from '~/hooks/useEffectAsync'
import { useObserve } from '~/hooks/useObserve'
import { ArticleListItem } from '~/types'
import { animations } from '~/utils/animations'
import { functions } from '~/utils/functions'
import { styles } from '~/utils/styles'

type ContainerProps = {
  article: ArticleListItem
  className: string
}
type ComponentProps = {
  display: boolean
  refs: {
    root: React.MutableRefObject<HTMLDivElement | null>
  }
} & ContainerProps

const Component: React.FC<ComponentProps> = (props) => (
  <div ref={props.refs.root} className={props.className}>
    {props.display && (
      <Link
        as={`/articles/${props.article.id}`}
        href="/articles/[id]"
        prefetch={false}
      >
        <a>
          <div className="thumbnail">
            <Image
              alt=""
              src={functions.withImageParams(
                props.article.thumbnail?.url || '/images/base/ogp.png',
                { w: 600, h: 400, fit: 'crop', q: 60 }
              )}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <div className="title">{props.article.title}</div>
          <div className="publishedAt">
            {functions.date(props.article.published)}
          </div>
        </a>
      </Link>
    )}
  </div>
)

const StyledComponent = styled(Component)`
  min-height: 30rem;
  opacity: 0;
  transform: translateY(15rem);
  > a {
    display: block;
    .thumbnail {
      position: relative;
      width: 100%;
      height: 24rem;
      overflow: hidden;
      opacity: 0.8;
    }
    .title {
      ${styles.mixins.lhCrop(1.8)}
      margin-top: 3rem;
      padding: 0 7rem;
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      letter-spacing: 0.2rem;
      ${styles.media.sp} {
        font-size: 1.4rem;
      }
    }
    .publishedAt {
      margin-top: 2rem;
      text-align: center;
      font-size: 1.1rem;
      line-height: 1;
      letter-spacing: 0.2rem;
      opacity: 0.4;
      ${styles.media.sp} {
        font-size: 1.2rem;
      }
    }
  }
`

const Container: React.FC<ContainerProps> = (props) => {
  const [display, setDisplay] = useState(false)

  const refs = {
    root: useRef<HTMLDivElement>(null),
  }

  useObserve({
    deps: [refs.root, display],
    observeIn: () => {
      if (!display) setDisplay(true)
    },
    ref: refs.root,
  })

  useEffectAsync({
    deps: [display, refs.root],
    effect: () => {
      if (display && refs.root.current) {
        animations.opacity(refs.root.current, 1, 1, 'InOut')
        animations.y(refs.root.current, 0, 2, 'Out')
      }
    },
  })

  return <StyledComponent display={display} refs={refs} {...props} />
}

export default Container
