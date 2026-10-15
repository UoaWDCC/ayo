import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhotoThumbnailCell } from './index'
vi.mock('@payloadcms/ui', () => ({
  useConfig: () => ({ config: { serverURL: '', routes: { api: '/api' } } }),
}))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('photo thumbnails', () => {
  it('loads the small image variant instead of the original', () => {
    render(
      <PhotoThumbnailCell
        cellData={{
          id: 'photo',
          alt: 'Orchestra',
          url: '/original.jpg',
          sizes: { thumbnail: { url: '/small.jpg' } },
        }}
      />,
    )
    expect(screen.getByRole('img').getAttribute('src')).toBe('/small.jpg')
  })
  it('uses original images for legacy uploads and updates when the value changes', () => {
    const { rerender } = render(
      <PhotoThumbnailCell cellData={{ id: 'first', alt: 'Photo', url: '/first.jpg' }} />,
    )
    expect(screen.getByRole('img').getAttribute('src')).toBe('/first.jpg')
    rerender(<PhotoThumbnailCell cellData={{ id: 'second', alt: 'Photo', url: '/second.jpg' }} />)
    expect(screen.getByRole('img').getAttribute('src')).toBe('/second.jpg')
    rerender(<PhotoThumbnailCell />)
    expect(screen.queryByRole('img')).toBeNull()
  })
  it('resolves an upload ID and removes the thumbnail when the reference is cleared', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'photo',
        alt: 'Photo',
        url: '/original.jpg',
        sizes: { thumbnail: { url: '/small.jpg' } },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const { rerender } = render(<PhotoThumbnailCell cellData="photo" />)
    expect((await screen.findByRole('img')).getAttribute('src')).toBe('/small.jpg')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/media/photo?depth=0',
      expect.objectContaining({ credentials: 'include' }),
    )
    rerender(<PhotoThumbnailCell />)
    expect(screen.queryByRole('img')).toBeNull()
  })
})
