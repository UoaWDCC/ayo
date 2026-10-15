import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { useMediaUrl } from './useMediaUrl'
vi.mock('@payloadcms/ui', () => ({
  useConfig: () => ({ config: { serverURL: '', routes: { api: '/api' } } }),
}))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
describe('preview image resolution', () => {
  it('renders populated media and removes it when cleared', () => {
    const { result, rerender } = renderHook(({ value }) => useMediaUrl(value), {
      initialProps: { value: { url: '/photo.jpg' } as unknown },
    })
    expect(result.current?.url).toBe('/photo.jpg')
    rerender({ value: null })
    expect(result.current).toBeNull()
  })
  it('does not display the previous image while a new ID loads', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({ url: '/one.jpg' }) })
        .mockImplementationOnce(() => new Promise(() => {})),
    )
    const { result, rerender } = renderHook(({ value }) => useMediaUrl(value), {
      initialProps: { value: 'one' },
    })
    await waitFor(() => expect(result.current?.url).toBe('/one.jpg'))
    rerender({ value: 'two' })
    expect(result.current).toBeNull()
  })
  it('handles an unavailable upload without retaining an unrelated image', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const { result } = renderHook(() => useMediaUrl('missing'))
    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(result.current).toBeNull()
  })
})
