import { z } from 'zod'

export const compactSearchSchema = z.object({
  q: z.string().min(1),
  inventoryId: z.coerce.number().int().positive().optional(),
  dealerId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
})
