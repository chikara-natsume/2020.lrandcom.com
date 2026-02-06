import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  buildUpstreamImageUrl,
  parseMediaProxyQuery,
  verifyMediaProxySignature,
} from '~/lib/mediaProxy'

const CACHE_CONTROL = 'public, s-maxage=2592000, stale-while-revalidate=86400'

const methodNotAllowed = (res: NextApiResponse): void => {
  res.setHeader('Allow', 'GET')
  res.status(405).json({ message: 'Method Not Allowed' })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'GET') {
    methodNotAllowed(res)
    return
  }

  const parsed = parseMediaProxyQuery(req.query)
  if (!parsed.ok) {
    res.status(parsed.status).json({ message: parsed.message })
    return
  }
  if (!verifyMediaProxySignature(parsed.params)) {
    res.status(403).json({ message: 'invalid signature' })
    return
  }

  try {
    const upstreamUrl = buildUpstreamImageUrl(parsed.params)
    const upstreamResponse = await axios.get<ArrayBuffer>(upstreamUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      validateStatus: () => true,
    })

    if (upstreamResponse.status >= 400) {
      const status = upstreamResponse.status === 404 ? 404 : 502
      res.status(status).json({ message: 'failed to fetch image' })
      return
    }

    const contentType =
      upstreamResponse.headers['content-type'] || 'application/octet-stream'
    const contentLength = upstreamResponse.headers['content-length']

    res.setHeader('Cache-Control', CACHE_CONTROL)
    res.setHeader('Content-Type', contentType)
    res.setHeader('X-Content-Type-Options', 'nosniff')
    if (contentLength) {
      res.setHeader('Content-Length', contentLength)
    }

    res.status(200).send(Buffer.from(upstreamResponse.data))
  } catch {
    res.status(502).json({ message: 'failed to fetch image' })
  }
}
