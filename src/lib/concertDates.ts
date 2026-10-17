export const NZ_TIME_ZONE = 'Pacific/Auckland'

/** Format stored UTC instants consistently for AYO, including NZ daylight saving. */
export function formatNZDateTime(
  iso: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-NZ', { ...options, timeZone: NZ_TIME_ZONE }).format(date)
}
