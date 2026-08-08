import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styled from 'styled-components'

import ABlank from '~/components/base/ABlank'
import IncludeBr from '~/components/base/IncludeBr'
import Card from '~/components/index/card'
import { config } from '~/utils/config'
import { styles } from '~/utils/styles'

type ContainerProps = {
  className: string
}
type ComponentProps = {} & ContainerProps

const Component: React.FC<ComponentProps> = (props) => (
  <div className={props.className}>
    <div className="head">
      <div className="title">お問い合わせ</div>
      <IncludeBr
        className="description"
        text="メディア構築、コンテンツ作成をご希望の企業様から、面白いコンテンツを作ってみたいライターやクリエイターさん、そして、ただオフィスに遊びに来たいという変わり者の方まで、お気軽に下記のメールアドレスからご連絡下さい。"
      />
      <a href="mailto:hello@lrandcom.com">
        <FontAwesomeIcon icon={config.icons.mail} />{' '}
        <span>HELLO@LRANDCOM.COM</span>
      </a>
    </div>
    <Card className="card">
      {config.outline.map((row, index) => (
        <React.Fragment key={index}>
          <dl>
            <dt>{row.head}</dt>
            <dd>
              {row.data}
              {row.link && (
                <ABlank className="link" href={row.link.href}>
                  {row.link.text}
                </ABlank>
              )}
            </dd>
          </dl>
        </React.Fragment>
      ))}
    </Card>
  </div>
)

const StyledComponent = styled(Component)`
  ${styles.mixins.flexCenter};
  ${styles.media.sp} {
    display: block;
  }
  > .head {
    width: 30vw;
    ${styles.media.sp} {
      width: 100%;
    }
    .title {
      font-size: 4.2rem;
      font-weight: bold;
      line-height: 1;
      letter-spacing: 0.5rem;
      transform: skew(-5deg);
      ${styles.media.sp} {
        font-size: 2.6rem;
      }
    }
    .description {
      ${styles.mixins.lhCrop(1.6)}
      margin-top: 4.5rem;
      font-size: 1.4rem;
      letter-spacing: 0.1rem;
      white-space: pre-wrap;
      ${styles.media.sp} {
        margin-top: 3rem;
      }
    }
  }
  > * > a {
    display: flex;
    align-items: center;
    margin-top: 4.5rem;
    font-size: 1.75rem;
    ${styles.media.sp} {
      margin-top: 3rem;
      font-size: 2rem;
    }
    > svg {
      width: 1rem;
      height: auto;
    }
  }
  > * > a > span {
    ${styles.mixins.logoStyle}
    margin-left: 2rem;
    display: inline-block;
    ${styles.media.sp} {
      font-size: 2.6rem;
    }
  }
  > .card {
    ${styles.mixins.lhCrop(2)};
    margin-left: 7.5vw;
    width: 37.5vw;
    ${styles.media.sp} {
      margin: 3rem 0 0;
      width: 100%;
    }
  }
  > * > dl {
    display: flex;
    justify-content: space-between;
    opacity: 0.65;
  }
  > * > dl:not(:first-child) {
    margin-top: 3rem;
  }
  > * > * > dt {
    opacity: 0.65;
  }
  > * > * > dd {
    width: 70%;
    ${styles.media.sp} {
      width: 65%;
    }
    > .link {
      border-bottom: 1px solid;
    }
  }
`

const Container: React.FC<ContainerProps> = (props) => {
  return <StyledComponent {...props} />
}

export default Container
