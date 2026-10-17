import { createHash } from 'node:crypto'
import {
  APIError,
  commitTransaction,
  initTransaction,
  killTransaction,
  type Endpoint,
  type PayloadRequest,
} from 'payload'
import { orderGroups, orderGroup, type OrderDocument, type ReorderCollection } from '@/lib/ordering'

async function snapshot(collection: ReorderCollection, req: PayloadRequest) {
  const { docs } = await req.payload.find({
    collection,
    pagination: false,
    depth: collection === 'people' ? 1 : 0,
    overrideAccess: false,
    req,
  })
  const documents: OrderDocument[] = docs
  const revision = createHash('sha256')
    .update(
      JSON.stringify(
        documents
          .map((doc) => [doc.id, doc.updatedAt, doc.sortOrder ?? 0, orderGroup(collection, doc).id])
          .sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
      ),
    )
    .digest('hex')
  return { documents, revision, groups: orderGroups(collection, documents) }
}
export function reorderEndpoints(collection: ReorderCollection): Endpoint[] {
  return [
    {
      path: '/reorder',
      method: 'get',
      handler: async (req) => {
        if (!req.user) throw new APIError('Please sign in to reorder records.', 401)
        const { revision, groups } = await snapshot(collection, req)
        return Response.json({ revision, groups })
      },
    },
    {
      path: '/reorder',
      method: 'post',
      handler: async (req) => {
        if (!req.user) throw new APIError('Please sign in to reorder records.', 401)
        let body: unknown
        try {
          body = await req.json?.()
        } catch {
          throw new APIError('Could not read the order. Reload it and try again.', 400)
        }
        if (!body || typeof body !== 'object')
          throw new APIError('Could not read the order. Reload it and try again.', 400)
        const { group, ids, revision } = body as Record<string, unknown>
        if (
          typeof group !== 'string' ||
          typeof revision !== 'string' ||
          !Array.isArray(ids) ||
          !ids.every((id): id is string => typeof id === 'string') ||
          new Set(ids).size !== ids.length
        )
          throw new APIError('The order must contain each record exactly once.', 400)
        const ownsTransaction = await initTransaction(req)
        if (!req.transactionID || !(await req.transactionID))
          throw new APIError(
            'Reordering is unavailable. No changes were saved. Contact website support.',
            503,
          )
        try {
          const current = await snapshot(collection, req)
          if (revision !== current.revision)
            throw new APIError(
              'These records changed since you opened Reorder. Reload the order and try again.',
              409,
            )
          const expected = current.groups
            .find((item) => item.id === group)
            ?.items.map((item) => item.id)
          const expectedIDs = new Set(expected)
          if (!expected || expected.length !== ids.length || ids.some((id) => !expectedIDs.has(id)))
            throw new APIError('The group changed. Reload the order and try again.', 409)
          const documentsByID = new Map(current.documents.map((doc) => [doc.id, doc]))
          for (const [index, id] of ids.entries()) {
            const original = documentsByID.get(id)!
            // Updating every member also makes concurrent reorders conflict at the database level.
            const result = await req.payload.update({
              collection,
              where: {
                and: [{ id: { equals: id } }, { updatedAt: { equals: original.updatedAt } }],
              },
              data: { sortOrder: index + 1 },
              overrideAccess: false,
              req,
            })
            if (result.errors.length || result.docs.length !== 1)
              throw new APIError(
                'A record changed or could not be updated. No order was saved.',
                409,
              )
          }
          const saved = await snapshot(collection, req)
          if (ownsTransaction) await commitTransaction(req)
          return Response.json({ revision: saved.revision, groups: saved.groups })
        } catch (error) {
          if (ownsTransaction) await killTransaction(req)
          throw error
        }
      },
    },
  ]
}
