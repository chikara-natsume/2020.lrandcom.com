import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import Email from '~/components/about/Email'
import Lead from '~/components/about/lead'
import Logo from '~/components/about/Logo'
import OurClient from '~/components/about/OurClient'
import Outline from '~/components/about/Outline'
import Button from '~/components/base/Button'
import Head from '~/components/base/Head'
import { usePageScroll } from '~/hooks/usePageScroll'
import { StateTypes } from '~/store'
import { setSlug } from '~/store/header'
import { config } from '~/utils/config'
import { styles } from '~/utils/styles'

type ContainerProps = {
  className: string
}
type ComponentProps = {
  sp: boolean
} & ContainerProps

const Component: React.FC<ComponentProps> = (props) => (
  <div className={props.className}>
    <Head
      image={`${config.url.production}/images/base/ogp.png`}
      title="サービス・会社概要 / リーディング＆カンパニー株式会社"
      type="website"
    />
    <Logo className="logo" />
    <div className="margin line" />
    <Outline className="wrapper" />
    <div className="margin line" />
    <div className="margin line" />
    <Lead className="wrapper">
      リーディング＆カンパニーは東京を拠点とするマーケティング会社です。マーケティング記事の作成を中心にサイト制作、動画制作などを大企業から中小企業の法人様にご提供しております。
    </Lead>
    <div className="margin line" />
    <div className="margin line" />
    {/* <Thumbnail className="margin thumbnail" /> */}
    {/* <div className="margin line" /> */}
    <div className="wrapper">
      <h2>記事コンテンツの作成</h2>
      <img alt="" src="/images/about/article.jpg" />
      <div className="text marginTop">
        リーディング＆カンパニーでは、こちらの弊社独自で作成している記事のような一つの物事を複数の別の視点から捉えて書く記事コンテンツの作成を得意としています。
        <br />
        <br />
        企業が行う主体の事業を入口として、世の中を俯瞰的に見れば、ライフスタイル、文化、経済、そして、テクノロジーから心理学まで、様々な分野へのつながりが「点」として存在しています。
        <br />
        <br />
        このような少し異なった分野の概念の「点」と、企業が主体とするビジネスとの「点」との文脈を見つけ出し、上手くつなぎ合わせていくことで、読み手に新しい気づきを与えるオリジナルの記事コンテンツをつくることができるのです。
        <br />
        <br />
        むしろ、現代のような、様々なことが複雑に入り組んだ世界では、専門的な一つの視点から記事を作成して魅力を伝えようとするよりも、できるだけ別の異なった視点からコンテンツをつくり、間接的に商品やサービスの魅力を伝えた方が、圧倒的に伝わりやすいと言えるでしょう。
        <br />
        <br />
        リーディング＆カンパニーでは、企業が伝えたいメッセージを汲み取り、大量のリサーチと取材を繰り返しながら、一般の方々に分かりやすく伝わる記事コンテンツを作成していきます。
      </div>
      <Link as="/articles/create_contents" href="/articles/[id]">
        <a className="marginTop">
          <Button className="button">詳しくはこちらから</Button>
        </a>
      </Link>
    </div>
    <div className="margin line" />
    <div className="margin line" />
    <div className="wrapper">
      <h2>マーケティング・PRチーム育成支援</h2>
      <img alt="" src="/images/about/writing.jpg" />
      <div className="text marginTop">
        マーケティングやPRの能力を身につける一番の近道は、文章を書く力を身につけることです。
        <br />
        <br />
        多くの企業が様々なコンテンツを作成し、日々メッセージを発信していますが、そのほとんどは、血の通った人間味のあるコンテンツではありません。
        <br />
        <br />
        読み手のことを考えて、時間を惜しまず、一文一文丁寧に文章をつくっている企業はほとんどないことでしょう。
        <br />
        <br />
        リーディング＆カンパニーでは、記事の作り方から、リサーチの仕方、そして、面白い視点の見つけ方まで、日々実践的に使っている方法をもとにマーケティング・PR人材の育成をサポート致します。
        <br />
        <br />
        <Button className="button">Coming Soon.</Button>
      </div>
    </div>
    <div className="margin line" />
    <div className="margin line" />
    <div className="wrapper">
      <h2>ウェブサイト制作 </h2>
      <img alt="" src="/images/about/website.jpg" />
      <div className="text marginTop">
        会社が面白そうかどうかは、その会社のウェブサイトを見れば大体のことは分かります。
        <br />
        <br />
        これからの時代は、オフィスのデザイン以上に、企業のウェブサイトをどのような見せ方にするかを考えることが重要だと言えるのかもしれません。
        <br />
        <br />
        魅力的なウェブサイトの条件は、スピードが速くサクサク動くこと、シェイクスピアのような美しいコードで書かれていること、そして、納期というものを設けず、常にアップデートしていくことです。
        <br />
        <br />
        Googleはユーザー体験を考慮し、ページの表示が速いサイトは検索順位の上位に上げ、ページの表示が遅いサイトに対しては、検索順位を下げるペナルティーをかける傾向にあるのだと言います。
        <br />
        <br />
        リーディング＆カンパニーでは、機能的でスピードの速いウェブサイトを理想とし、デザインとエンジニアリングを両立することで、コードを書きながらデザインをしていきます。
        <br />
        <br />
        <Button className="button">Coming Soon.</Button>
      </div>
    </div>
    <div className="margin line" />
    <div className="margin line" />
    <div className="wrapper">
      <h2>映像制作</h2>
      <img alt="" src="/images/about/movie.jpg" />
      <div className="text marginTop">
        これからの動画コンテンツには、プロがつくるプレミア感とYouTubeなどに見られるアマチュア感を両立していかなければなりません。何より重要なのは、「つくりもの感」が取り除かれて、動画がより本物らしく見えることでしょう。
        <br />
        <br />
        照明、編集、脚本が重要なのは言うまでもありませんが、ウェブ動画の世界では、こういった制作における創意工夫以上に、独自のアイディアや視点といったものが評価されます。
        <br />
        <br />
        リーディング＆カンパニーでは、プロとアマチュアの両方の視点から物事を考え、動画を制作していきます。
        <br />
        <br />
        <Button className="button">Coming Soon.</Button>
      </div>
    </div>
    <div className="margin line" />
    <div className="margin line" />
    <OurClient className="wrapper" />
    <div className="margin line" />
    <Email className="margin thumbnail" />
    <div className="margin line" />
    <div className="wrapper">
      <div className="text">
        コンテンツ作成、メディア構築などをご希望の企業様はお気軽に上記のメールアドレスからご連絡下さい。
      </div>
    </div>
    <div className="margin line" />
    <div className="margin line" />
    <div className="wrapper">
      <h2>キャリア</h2>
      <div className="text marginTop">
        多極的な視点で物事を考えられるライターを常に募集しています。キャリアや経験はハシゴではなくジャングルジム。常識とは異なった視点で、ライティングを通じ、未来の解像度を上げていって下さい。読書好き、旅行好き、運動好きであればパーフェクト!
        <br />
        <br />
        <Button className="button">Coming Soon.</Button>
      </div>
    </div>
    <div className="margin line" />
    <div className="margin line" />
    <div className="wrapper">
      <h2>つながる</h2>
      <div className="text marginTop">
        リーディング＆カンパニーでは、このサイトを通じて、ゆるーく、長く、つながれるコミュニティを運営しております。
        <br />
        <br />
        「予防医学」の見解によれば、健康と寿命に一番大きな影響を与えるのは運動や食生活ではなく、人間関係を中心とした「つながり」があるか、ないかなのだそうです。
        <br />
        <br />
        こちらのコミュニティでは、ZOOMを通じた勉強会やリアルイベントの交流会を定期的に行っています。
        <br />
        <br />
        <Button className="button">Coming Soon.</Button>
      </div>
    </div>
    <div className="margin line" />
    <div className="margin line" />
  </div>
)

const StyledComponent = styled(Component)`
  > .margin {
    margin-top: 6rem;
    ${styles.media.sp} {
      margin-top: 3rem;
    }
  }
  > .wrapper {
    margin: 6rem auto 0;
    width: 70rem;
    ${styles.media.sp} {
      margin: 3rem auto 0;
      width: calc(100% - 6rem);
    }
    > h2 {
      font-size: 1.6rem;
      letter-spacing: 0.1rem;
    }
    > img {
      margin-top: 6rem;
      width: 100%;
      ${styles.media.sp} {
        margin-top: 3rem;
      }
    }
    > .text {
      ${styles.mixins.lhCrop(2)}
      font-size: 1.6rem;
      letter-spacing: 0.1rem;
      opacity: 0.65;
      ${styles.media.sp} {
        font-size: 1.4rem;
      }
    }
    > .marginTop {
      margin-top: 6rem;
      ${styles.media.sp} {
        margin-top: 3rem;
      }
    }
    > a {
      display: inline-block;
    }
  }
  > .logo {
    margin-top: 15.5rem;
    width: 100%;
    height: 47.5rem;
    ${styles.media.sp} {
      margin-top: 9.5rem;
    }
  }
  > .thumbnail {
    width: 100%;
    height: 47.5rem;
  }
  > .line {
    width: 100%;
    height: 1px;
    background: white;
    opacity: 0.03;
  }
`

const Container: React.FC<ContainerProps> = (props) => {
  const dispatch = useDispatch()
  const sp = useSelector((state: StateTypes) => state.media.sp)

  dispatch(setSlug('/ABOUT'))
  usePageScroll()

  return <StyledComponent sp={sp} {...props} />
}

export default Container
