import { z } from 'zod'

export const compactSearchSchema = z.object({
  q: z.string().min(1),
  inventoryId: z.string().optional(),
})
