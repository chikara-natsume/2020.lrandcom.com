import React from 'react'
import styled from 'styled-components'

import Heading from '~/components/about/heading'
import ABlank from '~/components/base/ABlank'
import { config } from '~/utils/config'
import { styles } from '~/utils/styles'

type ContainerProps = {
  className: string
}
type ComponentProps = {} & ContainerProps

const Component: React.FC<ComponentProps> = (props) => (
  <div className={props.className}>
    <Heading className="heading">会社概要</Heading>
    <div className="body">
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
    </div>
  </div>
)

const StyledComponent = styled(Component)`
  display: flex;
  justify-content: space-between;
  font-size: 1.4rem;
  letter-spacing: 0.1rem;
  ${styles.media.sp} {
    display: block;
  }
  .heading {
    font-weight: bold;
  }
  .body {
    width: 78%;
    opacity: 0.65;
    ${styles.media.sp} {
      margin-top: 3rem;
      width: 100%;
    }
  }
  > * > dl {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  > * > dl:not(:first-child) {
    margin-top: 3rem;
  }
  > * > * > dt {
    opacity: 0.65;
  }
  > * > * > dd {
    ${styles.mixins.lhCrop(2)};
    width: 75%;
    ${styles.media.sp} {
      width: 70%;
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
