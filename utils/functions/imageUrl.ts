type ImageParams = Partial<{
  w: number
  h: number
  q: number
  fit: 'clip' | 'clamp' | 'crop' | 'max'
}>

export const withImageParams = (url: string, params: ImageParams): string => {
  if (!url || url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        parsed.searchParams.set(key, String(value))
      }
    })
    return parsed.toString()
  } catch {
    return url
  }
}
