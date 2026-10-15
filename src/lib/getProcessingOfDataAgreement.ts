import type { ProcessingOfDataAgreement } from '@/payload-types'
import { getCurrentSettingsRecord } from './getCurrentSettingsRecord'

export async function getProcessingOfDataAgreement(): Promise<ProcessingOfDataAgreement | null> {
  return getCurrentSettingsRecord('processing-of-data-agreement')
}
