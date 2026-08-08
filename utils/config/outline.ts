type OutlineRow = {
  data: string
  head: string
  link?: {
    href: string
    text: string
  }
}

const outline: OutlineRow[] = [
  {
    data: 'リーディング＆カンパニー株式会社（Leading & Company Inc.）',
    head: '会社名',
  },
  {
    data: '東京都渋谷区円山町5番3号 MIEUX渋谷ビル8階',
    head: '本社所在地',
  },
  {
    data: '2014年2月3日',
    head: '設立',
  },
  {
    data: '夏目力',
    head: '代表取締役',
  },
  {
    data: 'Webマーケティング支援およびクリエイティブ制作、越境ECを通じた輸出販売事業、',
    head: '事業内容',
    link: {
      href: 'https://natsume88.com/',
      text: 'オリジナル果汁飲料の企画・販売',
    },
  },
  {
    data: '600万円',
    head: '資本金',
  },
  {
    data: '03-4405-4290',
    head: '電話番号',
  },
  {
    data: 'hello@lrandcom.com',
    head: 'Email',
  },
]

export default outline
