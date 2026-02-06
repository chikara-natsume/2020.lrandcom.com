import crypto from 'crypto'

import { config } from '~/utils/config'

export type ImageFit = 'clip' | 'clamp' | 'crop' | 'max'

export type MediaTransformParams = Partial<{
  w: number
  h: number
  q: number
  fit: ImageFit
}>

type UnsignedMediaProxyParams = { u: string } & MediaTransformParams

export type SignedMediaProxyParams = UnsignedMediaProxyParams & {
  sig: string
}

type MediaProxyQueryInput = {
  [key: string]: string | string[] | undefined
}

export const MEDIA_PROXY_ALLOWED_QUERY_KEYS = [
  'u',
  'w',
  'h',
  'q',
  'fit',
  'sig',
] as const

const MEDIA_PROXY_ALLOWED_QUERY_KEY_SET = new Set<string>(
  MEDIA_PROXY_ALLOWED_QUERY_KEYS
)

const ALLOWED_IMAGE_HOSTS = new Set([
  'images.microcms-assets.io',
  'images.microcms.io',
])
const ALLOWED_FITS = new Set<ImageFit>(['clip', 'clamp', 'crop', 'max'])

const MAX_DIMENSION = 2000
const MIN_QUALITY = 40
const MAX_QUALITY = 85

const getSecret = (): string => {
  const secret = process.env.MEDIA_PROXY_SECRET
  if (!secret) {
    throw new Error('MEDIA_PROXY_SECRET is required')
  }
  return secret
}

const getSingleQueryValue = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) return value[0]
  return value
}

const parseNumberInRange = (
  raw: string | undefined,
  key: 'w' | 'h' | 'q',
  min: number,
  max: number
): number | undefined => {
  if (raw === undefined || raw === '') return undefined
  if (!/^[0-9]+$/.test(raw)) {
    throw new Error(`${key} must be an integer`)
  }
  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${key} must be between ${min} and ${max}`)
  }
  return value
}

const normalizeTransformParams = (
  params: MediaTransformParams
): MediaTransformParams => {
  const normalized: MediaTransformParams = {}
  if (params.w !== undefined) {
    normalized.w = parseNumberInRange(
      String(params.w),
      'w',
      1,
      MAX_DIMENSION
    )
  }
  if (params.h !== undefined) {
    normalized.h = parseNumberInRange(
      String(params.h),
      'h',
      1,
      MAX_DIMENSION
    )
  }
  if (params.q !== undefined) {
    normalized.q = parseNumberInRange(
      String(params.q),
      'q',
      MIN_QUALITY,
      MAX_QUALITY
    )
  }
  if (params.fit !== undefined) {
    if (!ALLOWED_FITS.has(params.fit)) {
      throw new Error('fit is invalid')
    }
    normalized.fit = params.fit
  }
  return normalized
}

const canonicalizeUnsignedParams = (params: UnsignedMediaProxyParams): string => {
  const query = new URLSearchParams()
  query.set('u', params.u)
  if (params.w !== undefined) query.set('w', String(params.w))
  if (params.h !== undefined) query.set('h', String(params.h))
  if (params.q !== undefined) query.set('q', String(params.q))
  if (params.fit !== undefined) query.set('fit', params.fit)
  return query.toString()
}

const signCanonicalParams = (canonical: string): string => {
  return crypto.createHmac('sha256', getSecret()).update(canonical).digest('hex')
}

const toAbsoluteSiteUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path
  return `${config.url.production}${path}`
}

const toBase64Url = (buffer: Buffer): string => {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

const fromBase64Url = (encoded: string): Buffer | null => {
  try {
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padding =
      normalized.length % 4 === 0
        ? ''
        : '='.repeat(4 - (normalized.length % 4))
    return Buffer.from(`${normalized}${padding}`, 'base64')
  } catch {
    return null
  }
}

const toEncryptionKey = (): Buffer => {
  return crypto.createHash('sha256').update(getSecret()).digest()
}

const encodeSourceUrl = (url: string): string => {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', toEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(url, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return toBase64Url(Buffer.concat([iv, authTag, encrypted]))
}

const decodeSourceUrl = (encoded: string): string | null => {
  try {
    const payload = fromBase64Url(encoded)
    if (!payload || payload.length <= 28) return null
    const iv = payload.subarray(0, 12)
    const authTag = payload.subarray(12, 28)
    const encrypted = payload.subarray(28)
    const decipher = crypto.createDecipheriv('aes-256-gcm', toEncryptionKey(), iv)
    decipher.setAuthTag(authTag)
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8')
    return decrypted || null
  } catch {
    return null
  }
}

export const hasOnlyAllowedMediaQueryKeys = (keys: string[]): boolean => {
  return keys.every((key) => MEDIA_PROXY_ALLOWED_QUERY_KEY_SET.has(key))
}

export const isAllowedMediaUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      ALLOWED_IMAGE_HOSTS.has(parsed.hostname.toLowerCase())
    )
  } catch {
    return false
  }
}

export const buildSignedMediaProxyUrl = (
  sourceUrl: string,
  params: MediaTransformParams = {},
  options: { absolute?: boolean } = {}
): string => {
  if (!sourceUrl) return sourceUrl
  if (sourceUrl.startsWith('/')) {
    return options.absolute ? toAbsoluteSiteUrl(sourceUrl) : sourceUrl
  }
  if (/^https?:\/\/[^/]+\/api\/media\?/i.test(sourceUrl)) {
    return options.absolute ? toAbsoluteSiteUrl(sourceUrl) : sourceUrl
  }
  if (!isAllowedMediaUrl(sourceUrl)) return sourceUrl

  const normalizedParams = normalizeTransformParams(params)
  const unsignedParams: UnsignedMediaProxyParams = {
    u: encodeSourceUrl(sourceUrl),
    ...normalizedParams,
  }
  const canonical = canonicalizeUnsignedParams(unsignedParams)
  const sig = signCanonicalParams(canonical)
  const query = new URLSearchParams(canonical)
  query.set('sig', sig)
  const path = `/api/media?${query.toString()}`
  return options.absolute ? toAbsoluteSiteUrl(path) : path
}

export const parseMediaProxyQuery = (
  query: MediaProxyQueryInput
):
  | { ok: true; params: SignedMediaProxyParams }
  | { ok: false; status: number; message: string } => {
  const keys = Object.keys(query)
  if (!hasOnlyAllowedMediaQueryKeys(keys)) {
    return { ok: false, status: 400, message: 'invalid query keys' }
  }

  const u = getSingleQueryValue(query.u)
  if (!u) {
    return { ok: false, status: 400, message: 'u is required' }
  }
  const decodedSourceUrl = decodeSourceUrl(u)
  if (!decodedSourceUrl) {
    return { ok: false, status: 400, message: 'u is invalid' }
  }
  if (!isAllowedMediaUrl(decodedSourceUrl)) {
    return { ok: false, status: 403, message: 'u host is not allowed' }
  }

  const sig = getSingleQueryValue(query.sig)
  if (!sig || !/^[0-9a-f]{64}$/i.test(sig)) {
    return { ok: false, status: 400, message: 'sig is invalid' }
  }

  try {
    const w = parseNumberInRange(getSingleQueryValue(query.w), 'w', 1, MAX_DIMENSION)
    const h = parseNumberInRange(getSingleQueryValue(query.h), 'h', 1, MAX_DIMENSION)
    const q = parseNumberInRange(
      getSingleQueryValue(query.q),
      'q',
      MIN_QUALITY,
      MAX_QUALITY
    )
    const fitRaw = getSingleQueryValue(query.fit)
    const fit =
      fitRaw === undefined
        ? undefined
        : ALLOWED_FITS.has(fitRaw as ImageFit)
        ? (fitRaw as ImageFit)
        : undefined
    if (fitRaw !== undefined && fit === undefined) {
      return { ok: false, status: 400, message: 'fit is invalid' }
    }

    return {
      ok: true,
      params: { u, w, h, q, fit, sig: sig.toLowerCase() },
    }
  } catch (error) {
    return {
      ok: false,
      status: 400,
      message: error instanceof Error ? error.message : 'query is invalid',
    }
  }
}

export const verifyMediaProxySignature = (
  params: SignedMediaProxyParams
): boolean => {
  const unsignedParams: UnsignedMediaProxyParams = {
    u: params.u,
    w: params.w,
    h: params.h,
    q: params.q,
    fit: params.fit,
  }
  const canonical = canonicalizeUnsignedParams(unsignedParams)
  let expected: string
  try {
    expected = signCanonicalParams(canonical)
  } catch {
    return false
  }
  if (params.sig.length !== expected.length) return false
  try {
    return crypto.timingSafeEqual(
      Buffer.from(params.sig, 'hex'),
      Buffer.from(expected, 'hex')
    )
  } catch {
    return false
  }
}

export const buildUpstreamImageUrl = (params: UnsignedMediaProxyParams): string => {
  const sourceUrl = decodeSourceUrl(params.u)
  if (!sourceUrl || !isAllowedMediaUrl(sourceUrl)) {
    throw new Error('u is invalid')
  }
  const upstream = new URL(sourceUrl)
  if (params.w !== undefined) upstream.searchParams.set('w', String(params.w))
  if (params.h !== undefined) upstream.searchParams.set('h', String(params.h))
  if (params.q !== undefined) upstream.searchParams.set('q', String(params.q))
  if (params.fit !== undefined) upstream.searchParams.set('fit', params.fit)
  return upstream.toString()
}
